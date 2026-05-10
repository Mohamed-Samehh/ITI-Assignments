# Unsupervised Learning

Unsupervised learning trains models on data **without labels**. The goal is to
discover hidden structure, groupings, or representations in the input itself.

## Main task families

- **Clustering**: grouping similar points together.
  - k-Means: partitions data into k clusters around centroids.
  - DBSCAN: density-based; finds clusters of arbitrary shape and identifies noise.
  - Hierarchical clustering: builds a tree (dendrogram) of nested clusters.
- **Dimensionality reduction**: compressing high-dimensional data while preserving
  structure.
  - PCA (Principal Component Analysis): linear projection onto top variance axes.
  - t-SNE and UMAP: nonlinear methods great for 2D/3D visualization.
  - Autoencoders: neural networks that learn a compact latent representation.
- **Density estimation**: modeling the probability distribution of the data
  (e.g. Gaussian Mixture Models, normalizing flows).
- **Anomaly detection**: identifying points that deviate from the learned
  distribution. Used in fraud detection, defect inspection, intrusion detection.

## When to use it

- You have lots of data but labeling is expensive or impossible.
- You want to explore structure before designing a supervised pipeline.
- You need to compress or visualize high-dimensional data.

## Evaluation

Unsupervised models are harder to evaluate because there is no ground truth label.
Common proxies:

- Silhouette score and Davies-Bouldin index for clustering.
- Reconstruction error for autoencoders.
- Downstream task performance: do the learned representations help a later
  supervised task?
