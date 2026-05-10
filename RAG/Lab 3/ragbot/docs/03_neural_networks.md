# Neural Networks

A neural network is a function composed of stacked layers of simple units called
neurons. Each neuron computes a weighted sum of its inputs, adds a bias, and
applies a nonlinear activation function (ReLU, sigmoid, tanh, GELU).

## Key components

- **Layers**: dense (fully connected), convolutional, recurrent, attention.
- **Weights and biases**: the learnable parameters.
- **Activation functions**: introduce nonlinearity so the network can model
  complex relationships.
- **Loss function**: measures how far predictions are from targets.
- **Optimizer**: updates parameters using gradients (SGD, Adam, AdamW).

## Training: backpropagation

Training proceeds by repeatedly:

1. Running a forward pass to compute predictions and the loss.
2. Computing gradients of the loss with respect to every parameter using the
   chain rule (backpropagation).
3. Updating parameters in the direction that reduces the loss.

## Common architectures

- **MLP (Multi-Layer Perceptron)**: stacked dense layers, baseline for tabular
  and small problems.
- **CNN (Convolutional Neural Network)**: uses convolutional filters that share
  weights across spatial locations. Standard for images.
- **RNN / LSTM / GRU**: process sequences one step at a time with internal
  state. Historically used for NLP and time series.
- **Transformer**: relies entirely on attention. Now dominant in NLP and
  increasingly in vision and other modalities.

## Regularization

Deep networks overfit easily. Common defenses:

- Dropout: randomly zero out activations during training.
- Weight decay (L2 regularization).
- Data augmentation.
- Early stopping based on validation loss.
- Batch normalization and layer normalization, which also stabilize training.
