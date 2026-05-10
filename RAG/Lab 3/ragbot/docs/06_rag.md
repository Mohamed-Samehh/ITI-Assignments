# Retrieval-Augmented Generation (RAG)

RAG is an architecture pattern that grounds an LLM's responses in an external
knowledge store. Instead of relying solely on the model's parametric memory,
the system retrieves relevant documents at query time and feeds them to the
model as context.

## Core pipeline

1. **Ingestion**: documents are split into chunks (a few hundred tokens each),
   embedded, and stored in a vector database alongside metadata.
2. **Retrieval**: at query time, the user's question is embedded, and the top-k
   most similar chunks are fetched from the vector store.
3. **Augmentation**: those chunks are inserted into the LLM prompt as context.
4. **Generation**: the LLM produces an answer grounded in the retrieved text,
   often with citations back to the source documents.

## Why RAG instead of fine-tuning

- Knowledge updates are cheap: re-index, no retraining.
- The source of every claim is auditable.
- Sensitive or private data stays in your retrieval store; the base model is
  unchanged.
- Token cost can be controlled by retrieving only what is needed.

## Agentic RAG

Agentic RAG goes beyond a single retrieval step. The LLM acts as an agent that
can decide:

- Whether the question is in scope at all.
- Whether to retrieve, and what query to retrieve with.
- Whether the retrieved documents are actually relevant (a "grader" step).
- Whether to rewrite the query, retrieve more, or admit it does not know.

This routing logic is typically expressed as a graph (for example with
LangGraph), where each node is a focused step and edges encode the decisions.

## Common failure modes

- **Hallucination from weak context**: model invents details when retrieval
  misses. Mitigation: relevance grading, "I don't know" fallback.
- **Chunking too coarsely**: chunks contain too many topics. Mitigation:
  semantic or recursive chunking, smaller chunks with overlap.
- **Embedding/query mismatch**: queries are short and different in style from
  documents. Mitigation: query rewriting, hybrid search (BM25 + vectors),
  HyDE (hypothetical document embeddings).
