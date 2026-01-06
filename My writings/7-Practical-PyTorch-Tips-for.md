## Things I wish someone listed down.
![PyTorch Logo. Source: Internet.](https://miro.medium.com/v2/resize:fit:2000/1*3G90f7g9YfnJl0Haif-s5w.png)
`PyTorch` is a surprisingly simple language that allows you to train a model after reading a simple 2-minute article. But as we keep writing more, many things could give a qualitative improvement in the long run.
In the last two years, there have been surprisingly few points I (sometimes painfully) learned in my job. Here they are:
## 1\. Keep Things divided.
As we start writing models, we start by writing everything in a single class. We declare all the layers in a single `__init__` function. Yet, as the scale of the project increases, this leads to repetitive blocks. Hence, it's better to define the modules to use separately instead.
One classic example of this is the attention blocks in a `transformer` architecture. You need not define the same scaled\_dot\_products again and again. Rather, creating a `SimpleAttention()` block once and reusing it when needed is a better way to code.
## 2\. Track everything you can.
Not every model you train is going to work as intended. Having that hope is a fantasy. When you debug an experiment, you often need pinpointed data to identify the issue.
We all track the training and validation losses. However, some more commonly tracked metrics are gradients, validation metrics, learning rates, hardware utilisation, and model weights. Of course, not everything I mentioned should be tracked, but tracking most of these things would help in the long run.
For image projects, I often try to visualise the activations for at least one input during the validation steps. It’s a bit too much, but it helps identify where the issue is going wrong (and, more importantly, my mentor often asks that).
Now, there’s a different part of this issue. Where do you track these? Indeed, we can not always use `print()` statements to log everything, right? The easiest place to start is using the `logging` module. That's a good place to start. Gradually, you can expand your logging to include production-ready experiment trackers like WeightsAndBiases, TensorBoard, MLFlow, etc.
## 3\. Keep track of the shapes.
One of the common things we miss when writing architecture is the shapes in which the input is transformed. As the depth of the model increases, we often misidentify the shape of each block’s input and output tensors. So, it’s good to comment on the preferred shape beside the transformations.
## 4\. Don’t forget to use `.detach()`
We often try to check different transformations of the validation outputs or the losses during our experiments. But, using them directly also carries on the gradient properties of these tensors around. On large-scale data, the GPU utilisation explodes because of this simple error. So, it’s better to use the .detach() method for objects that aren’t being used as feedback for the model.
## 5\. Use `inference_mode() over no_grad()`
As of V1.9, we’ve got a new `inference_mode()` in PyTorch as an alternative for the earlier used `no_grad()`. These are mostly the same in context, but no\_grad() mode contains additional heads, like [version\_counting](https://pytorch.org/docs/stable/notes/autograd.html#:%7E:text=for%20backward%2C%20a-,version%20counter,-of%20their%20containing) and view tracking of tensors, that increase the computation head by 5-10%.
This 5–10% would be significantly more as the model scale increases. Hence, determining when to use each mode must be kept in mind. One key thing to remember is that as long as you do not need to compute gradients for a variable or a part of the model, `inference_mode()` is preferable.
## 6\. `map_location` and `to(device)` are different.
This was one of the most irritating things I’ve wasted time on. In my earlier months, I was used to loading the model through `.to(device)`, but this became a huge issue when dealing with large models. Especially when shifting the model trained on multiple GPUs to a single GPU/CPU or vice-versa.
This essentially loads the model to a default device and then pushes it into the device mentioned in `.to(device)`. That's irritating when the default device is either missing or doesn't have enough memory in it. `map_location` sequentially loads the device directly into the specified device.
I won’t go into much detail regarding this, as I have mentioned the issue in one of my previous articles.
## 07\. Avoid CPU-GPU synchronizations if possible.
When we call one of the following lines,
-   `print(cuda_tensor)`
-   `cuda_tensor.item()`
-   `tensor.cuda()`, `cuda_tensor.cpu()` and equivalent `tensor.to(device)` calls
-   `cuda_tensor.nonzero()`
-   Control flow statements like `if (cuda_tensor !=0).all()`
The CPU and GPU have to be synchronised (_every one of these calls transfers data from GPU to CPU and dramatically slows your performance._), leading the CPU to stop until the synchronisation is done. Avoiding these when unnecessary lets the CPU run ahead and add more operations to the accelerator (GPU) queue.
These are the key things that brought a qualitative change in my work. Of course, there are a few more use-case-specific things that I still need to share with you all. But they are topics to discuss for another day.