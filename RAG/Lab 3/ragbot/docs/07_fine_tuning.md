# Fine-Tuning vs RAG vs Prompting

There are three main ways to adapt a large language model to your task. They
are not mutually exclusive and are often combined.

## Prompt engineering

You change only the prompt, not the model. Few-shot examples, system prompts,
chain-of-thought instructions, and structured output schemas all live here.
Cheapest and fastest to iterate, and surprisingly powerful with modern models.

## RAG

You augment the model with a retrieval system over your own documents. RAG is
the right choice when:

- The knowledge is large, frequently updated, or proprietary.
- You need citations and auditability.
- You want to control which documents the model can rely on.

## Fine-tuning

You update the model's parameters on your own examples. Variants:

- **Full fine-tuning**: every weight is updated. Expensive and rarely needed.
- **LoRA / QLoRA**: low-rank adapters. Train a small set of additional weights
  while freezing the base model. Cheap, mergeable, and quantization-friendly.
- **Instruction tuning**: train on (instruction, response) pairs to improve
  general following ability.
- **RLHF / DPO**: align model behavior to human preferences.

Fine-tuning is the right choice when:

- You need a specific style, tone, or output format the base model does not
  consistently produce.
- The task is narrow and the rules are stable.
- You want lower latency or smaller models in production.

## Rule of thumb

Start with prompting. If knowledge is the bottleneck, add RAG. If behavior or
format is the bottleneck even after good prompts and retrieval, fine-tune.
