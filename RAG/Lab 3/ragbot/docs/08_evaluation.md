# Evaluation Metrics

Picking the right evaluation metric is at least as important as picking the
right model. The metric is the only thing the model is implicitly trying to
optimize for, so a wrong metric leads to a wrong model.

## Classification

- **Accuracy**: fraction of correct predictions. Misleading on imbalanced data.
- **Precision**: of the items predicted positive, how many really are.
- **Recall (Sensitivity)**: of the actual positives, how many we caught.
- **F1 score**: harmonic mean of precision and recall.
- **ROC-AUC**: area under the receiver operating characteristic curve. Robust
  to threshold choice; needs probability scores.
- **PR-AUC**: area under the precision-recall curve. Better than ROC-AUC for
  highly imbalanced problems.
- **Confusion matrix**: raw counts of true positives, false positives, true
  negatives, false negatives. Always look at this first.

## Regression

- **MAE (Mean Absolute Error)**: average of |y - y_hat|. Robust to outliers.
- **MSE (Mean Squared Error)**: penalizes larger errors more.
- **RMSE (Root Mean Squared Error)**: in the same units as the target.
- **R squared**: fraction of variance explained by the model.
- **MAPE**: percentage-based; avoid when targets can be near zero.

## Ranking and retrieval

- **Recall@k**: did we retrieve a relevant item in the top k?
- **MRR (Mean Reciprocal Rank)**: average of 1 / rank of the first relevant hit.
- **NDCG (Normalized Discounted Cumulative Gain)**: rewards relevant items
  near the top, with graded relevance.

## LLM and generation

- Reference-based: BLEU, ROUGE, METEOR, BERTScore.
- LLM-as-judge: another model scores responses on rubrics like faithfulness,
  helpfulness, safety. Cheap and surprisingly correlated with humans, but
  watch for bias toward style and length.
- Task-specific: exact match for QA, pass@k for code, faithfulness and
  groundedness for RAG.
