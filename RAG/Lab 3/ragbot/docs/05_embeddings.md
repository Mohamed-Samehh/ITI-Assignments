# Embeddings and Vector Databases

An **embedding** is a dense numerical vector that represents a piece of data
(text, image, audio, code) in a way that preserves semantic similarity:
items with similar meaning end up near each other in vector space.

## How embeddings are produced

- For text, modern systems use transformer-based encoders such as
  text-embedding-3-small / large (OpenAI), Cohere embed, BGE, or sentence
  transformer models. They map a string to a fixed-size vector (e.g. 384,
  768, 1536, or 3072 dimensions).
- For images, CLIP and similar contrastive models map images and captions into
  a shared embedding space.

## Similarity metrics

- **Cosine similarity**: angle between vectors, ignoring magnitude. Most common
  for normalized text embeddings.
- **Dot product**: equivalent to cosine when vectors are unit-normalized.
- **Euclidean (L2) distance**: straight-line distance.

## Vector databases

A vector database stores embeddings and supports fast approximate nearest
neighbor (ANN) search. Popular options:

- FAISS (library, in-memory)
- Chroma, Qdrant, Weaviate, Milvus, LanceDB (full vector databases)
- pgvector (Postgres extension)
- Pinecone (managed)

ANN indexes (HNSW, IVF, PQ) trade a tiny bit of accuracy for orders-of-magnitude
speedups versus brute-force search.

## Typical use cases

- Semantic search and retrieval-augmented generation (RAG).
- Clustering and topic discovery.
- Deduplication and near-duplicate detection.
- Recommendation systems.
