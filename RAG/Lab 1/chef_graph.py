import os
from typing import TypedDict, Literal, Annotated
from dotenv import load_dotenv

from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langgraph.graph import StateGraph, END

load_dotenv()

# State Schema

class ChefState(TypedDict):
    messages: list
    ingredients: list[str]
    suggested_meals: list[str]
    chosen_meal: str
    current_step: int
    total_steps: int
    recipe_steps: list[str]
    phase: str
    creativity: float
    detail_level: str
    user_input: str


# LLM Helper

def get_llm(temperature: float = 0.7) -> ChatOpenAI:
    return ChatOpenAI(
        model="gpt-4o-mini",
        temperature=temperature,
        api_key=os.getenv("OPENAI_API_KEY"),
    )


def chef_system_prompt(state: ChefState) -> str:
    detail = state.get("detail_level", "concise")
    detail_instruction = (
        "Be brief and to the point. Max 2-3 sentences per response."
        if detail == "concise"
        else "Be thorough and descriptive. Explain techniques and tips."
    )

    return f"""You are Chef Antoine, a warm, passionate, and slightly humorous professional chef. 🧑‍🍳

PERSONALITY:
- Speak like a real chef: use terms like "beautiful", "gorgeous", "let's get cooking", "magnifique!"
- Be encouraging and enthusiastic about food
- Sprinkle in occasional chef metaphors and kitchen wisdom
- Remember everything the user has told you in this conversation

RESPONSE STYLE:
- Detail level: {detail}. {detail_instruction}
- Be human-like, not robotic. Use emojis sparingly but naturally.

RULES:
- NEVER skip steps in the cooking workflow
- Always stay in character as Chef Antoine
- If user asks something off-topic, gently redirect to cooking
"""


def call_chef(state: ChefState, prompt: str) -> str:
    """Call the LLM with chef persona + conversation history + specific prompt."""
    llm = get_llm(temperature=state.get("creativity", 0.7))
    system = SystemMessage(content=chef_system_prompt(state))
    
    # Build message history (last 20 messages to stay within context)
    history = state.get("messages", [])[-20:]
    msgs = [system] + history + [HumanMessage(content=prompt)]
    
    response = llm.invoke(msgs)
    return response.content


# Node Functions

def greet_node(state: ChefState) -> dict:
    """Welcome the user and ask for ingredients."""
    prompt = """The user just arrived. Welcome them warmly as Chef Antoine. 
    Ask them what ingredients they have available today. 
    Make it inviting and fun. Keep it short."""
    
    response = call_chef(state, prompt)
    
    return {
        "messages": state["messages"] + [AIMessage(content=response)],
        "phase": "collect_ingredients",
    }


def collect_ingredients_node(state: ChefState) -> dict:
    """Parse ingredients from user input and confirm them."""
    user_input = state["user_input"]
    
    # Use LLM to extract ingredients
    llm = get_llm(0.0)
    extract_prompt = f"""Extract all food ingredients from this text. Return ONLY a Python list of strings, nothing else.
    Text: "{user_input}"
    Example output: ["chicken", "rice", "garlic", "onion"]
    If no valid ingredients found, return: []"""
    
    result = llm.invoke([HumanMessage(content=extract_prompt)]).content.strip()
    
    try:
        ingredients = eval(result)
        if not isinstance(ingredients, list):
            ingredients = []
    except:
        ingredients = []

    existing = state.get("ingredients", [])
    all_ingredients = list(set(existing + ingredients))

    if not all_ingredients:
        response = call_chef(state, 
            "The user's input didn't contain clear ingredients. "
            "Politely ask them again to list their available ingredients.")
        return {
            "messages": state["messages"] + [
                HumanMessage(content=user_input),
                AIMessage(content=response)
            ],
            "phase": "collect_ingredients",
        }

    confirm_prompt = f"""The user has these ingredients: {all_ingredients}
    
    Confirm the ingredients back to them in a chef-like way.
    Ask if they have anything else to add, or if they'd like you to suggest meals.
    Also ask about any dietary restrictions or preferences."""

    response = call_chef(state, confirm_prompt)

    return {
        "messages": state["messages"] + [
            HumanMessage(content=user_input),
            AIMessage(content=response)
        ],
        "ingredients": all_ingredients,
        "phase": "analyze",
    }


def analyze_node(state: ChefState) -> dict:
    """User confirmed ingredients or added more. Decide next step."""
    user_input = state["user_input"].lower()
    
    # Check if user wants to add more ingredients
    llm = get_llm(0.0)
    intent_prompt = f"""The user said: "{state['user_input']}"
    They were asked if they want to add more ingredients or proceed to meal suggestions.
    
    Does the user want to: 
    A) Add more ingredients (they mention new food items)
    B) Proceed to suggestions (they say yes/ready/suggest/go ahead/no more/that's all/etc.)
    
    Reply ONLY with "A" or "B"."""
    
    intent = llm.invoke([HumanMessage(content=intent_prompt)]).content.strip()

    if "A" in intent:
        return {
            "messages": state["messages"] + [HumanMessage(content=state["user_input"])],
            "phase": "collect_ingredients",
            "user_input": state["user_input"],
        }

    return {
        "messages": state["messages"] + [HumanMessage(content=state["user_input"])],
        "phase": "suggest_meals",
    }


def suggest_meals_node(state: ChefState) -> dict:
    """Suggest 3 meals based on available ingredients."""
    ingredients = state.get("ingredients", [])
    
    suggest_prompt = f"""Based on these ingredients: {ingredients}

    Suggest exactly 3 meals the user can make. For each meal:
    - Give a catchy name
    - One-line description
    - Difficulty level (Easy/Medium/Hard)
    - Estimated time
    
    Number them 1, 2, 3. Ask the user to pick one.
    Be enthusiastic about the possibilities!"""

    response = call_chef(state, suggest_prompt)

    # Extract meal names
    llm = get_llm(0.0)
    extract = llm.invoke([HumanMessage(
        content=f'Extract exactly 3 meal names from this text as a Python list: "{response}"'
    )]).content.strip()
    
    try:
        meals = eval(extract)
    except:
        meals = ["Meal 1", "Meal 2", "Meal 3"]

    return {
        "messages": state["messages"] + [AIMessage(content=response)],
        "suggested_meals": meals,
        "phase": "choose_meal",
    }


def choose_meal_node(state: ChefState) -> dict:
    """User picks a meal; generate the step-by-step recipe."""
    user_input = state["user_input"]
    meals = state.get("suggested_meals", [])
    ingredients = state.get("ingredients", [])
    
    # Determine which meal was chosen
    llm = get_llm(0.0)
    pick_prompt = f"""The available meals are: {meals}
    The user said: "{user_input}"
    Which meal did they pick? Reply with ONLY the meal name exactly as listed. 
    If unclear, pick the closest match."""
    
    chosen = llm.invoke([HumanMessage(content=pick_prompt)]).content.strip().strip('"\'')

    detail = state.get("detail_level", "concise")
    
    # Generate recipe steps
    recipe_prompt = f"""The user chose: {chosen}
    Available ingredients: {ingredients}
    Detail level: {detail}
    
    Generate a step-by-step recipe. Return ONLY a Python list of step strings.
    Each step should be a clear cooking instruction.
    Include {"6-10 detailed steps" if detail == "detailed" else "4-7 concise steps"}.
    
    Example: ["Step 1: Dice the onions finely", "Step 2: Heat oil in a pan over medium heat", ...]"""
    
    steps_raw = llm.invoke([HumanMessage(content=recipe_prompt)]).content.strip()
    
    try:
        recipe_steps = eval(steps_raw)
        if not isinstance(recipe_steps, list):
            recipe_steps = [steps_raw]
    except:
        recipe_steps = [steps_raw]

    # Chef's excited response about the choice
    excitement_prompt = f"""The user chose to make: {chosen}! 
    Express excitement about their choice. Tell them you'll guide them step by step.
    Mention there are {len(recipe_steps)} steps total. Ask if they're ready to start cooking!"""
    
    response = call_chef(state, excitement_prompt)

    return {
        "messages": state["messages"] + [
            HumanMessage(content=user_input),
            AIMessage(content=response)
        ],
        "chosen_meal": chosen,
        "recipe_steps": recipe_steps,
        "total_steps": len(recipe_steps),
        "current_step": 0,
        "phase": "step_by_step",
    }


def step_by_step_node(state: ChefState) -> dict:
    """Deliver one recipe step at a time."""
    current = state.get("current_step", 0)
    total = state.get("total_steps", 0)
    steps = state.get("recipe_steps", [])
    user_input = state.get("user_input", "")
    
    if current >= total:
        # All steps done!
        finish_prompt = f"""All {total} steps are complete for {state.get('chosen_meal', 'the meal')}!
        Congratulate the user. Tell them to enjoy. 
        Ask if they want to cook something else or need any tips.
        Be warm and celebratory! 🎉"""
        
        response = call_chef(state, finish_prompt)
        
        return {
            "messages": state["messages"] + [
                HumanMessage(content=user_input),
                AIMessage(content=response)
            ] if user_input else state["messages"] + [AIMessage(content=response)],
            "phase": "done",
        }

    step_text = steps[current] if current < len(steps) else "Continue cooking..."
    
    step_prompt = f"""You're guiding step {current + 1} of {total} for {state.get('chosen_meal', 'the meal')}.
    
    The instruction is: {step_text}
    {"The user said: " + user_input if user_input and current > 0 else "The user is ready to start."}
    
    Deliver this step in your chef voice. Explain the technique briefly.
    If the user asked a question about the previous step, answer it first.
    End by asking if they're ready for the next step (or if this is the last step, tell them).
    Mention: Step {current + 1}/{total}"""
    
    response = call_chef(state, step_prompt)
    
    new_messages = state["messages"].copy()
    if user_input:
        new_messages.append(HumanMessage(content=user_input))
    new_messages.append(AIMessage(content=response))
    
    return {
        "messages": new_messages,
        "current_step": current + 1,
        "phase": "step_by_step" if (current + 1) < total else "finishing",
    }


def done_node(state: ChefState) -> dict:
    """Handle post-completion conversation."""
    user_input = state["user_input"].lower()
    
    # Check if user wants to start over
    llm = get_llm(0.0)
    intent = llm.invoke([HumanMessage(
        content=f'User said: "{user_input}". Do they want to cook something new? Reply YES or NO.'
    )]).content.strip()
    
    if "YES" in intent.upper():
        response = call_chef(state,
            "The user wants to cook something new! Reset and ask for new ingredients enthusiastically.")
        return {
            "messages": state["messages"] + [
                HumanMessage(content=state["user_input"]),
                AIMessage(content=response)
            ],
            "ingredients": [],
            "suggested_meals": [],
            "chosen_meal": "",
            "recipe_steps": [],
            "current_step": 0,
            "total_steps": 0,
            "phase": "collect_ingredients",
        }
    
    response = call_chef(state,
        f'The user said: "{state["user_input"]}". '
        'Respond helpfully as Chef Antoine. If they need tips, give them. '
        'Remind them they can cook something new anytime.')
    
    return {
        "messages": state["messages"] + [
            HumanMessage(content=state["user_input"]),
            AIMessage(content=response)
        ],
        "phase": "done",
    }


# Routing Logic

def route_by_phase(state: ChefState) -> str:
    """Route to the correct node based on current phase."""
    phase = state.get("phase", "greet")
    
    phase_map = {
        "greet": "greet",
        "collect_ingredients": "collect_ingredients",
        "analyze": "analyze",
        "suggest_meals": "suggest_meals",
        "choose_meal": "choose_meal",
        "step_by_step": "step_by_step",
        "finishing": "step_by_step",
        "done": "done",
    }
    return phase_map.get(phase, "greet")


# Build the Graph

def build_chef_graph():
    graph = StateGraph(ChefState)

    # Add all nodes
    graph.add_node("greet", greet_node)
    graph.add_node("collect_ingredients", collect_ingredients_node)
    graph.add_node("analyze", analyze_node)
    graph.add_node("suggest_meals", suggest_meals_node)
    graph.add_node("choose_meal", choose_meal_node)
    graph.add_node("step_by_step", step_by_step_node)
    graph.add_node("done", done_node)

    from langgraph.graph import START
    
    graph.add_conditional_edges(START, route_by_phase, {
        "greet": "greet",
        "collect_ingredients": "collect_ingredients",
        "analyze": "analyze",
        "suggest_meals": "suggest_meals",
        "choose_meal": "choose_meal",
        "step_by_step": "step_by_step",
        "done": "done",
    })

    # Every node ends after one execution
    graph.add_edge("greet", END)
    graph.add_edge("collect_ingredients", END)
    graph.add_edge("analyze", END)
    graph.add_edge("suggest_meals", END)
    graph.add_edge("choose_meal", END)
    graph.add_edge("step_by_step", END)
    graph.add_edge("done", END)

    return graph.compile()


# Singleton
chef_app = build_chef_graph()