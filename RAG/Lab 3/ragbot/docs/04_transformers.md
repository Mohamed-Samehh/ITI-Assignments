# Transformers and Attention

The Transformer is a neural network architecture introduced in the 2017 paper
"Attention Is All You Need". It replaced recurrence with **self-attention**,
making it parallelizable and dramatically more scalable than RNNs.

## Self-attention

Given a sequence of token embeddings, self-attention lets each token look at
every other token and weight them by relevance. Concretely, for each token we
compute three vectors:

- Query (Q)
- Key (K)
- Value (V)

The attention output for a token is a weighted sum of all Value vectors, where
the weights come from the softmax of Q dot K (scaled by sqrt(d_k)).

This means every token can attend directly to every other token in a single
operation, regardless of distance.

## Multi-head attention

Instead of one attention operation, transformers run several in parallel
(multiple "heads"), each with its own learned Q, K, V projections. Different
heads can specialize in different relationships (syntax, coreference, position).

## Positional encoding

Self-attention is order-agnostic, so transformers add positional information to
token embeddings. Originally sinusoidal; modern variants use learned positions,
RoPE (Rotary Positional Embedding), or ALiBi.

## Encoder vs decoder

- **Encoder-only** (BERT family): bidirectional attention; good for
  classification and embeddings.
- **Decoder-only** (GPT family, Llama, Claude): causal attention; generates one
  token at a time and is the basis for modern LLMs.
- **Encoder-decoder** (T5, original Transformer): used for translation and
  sequence-to-sequence tasks.

## Why transformers won

- Parallelism on GPUs (no sequential recurrence).
- Direct long-range dependencies through attention.
- Excellent scaling laws: bigger models on more data keep getting better.
