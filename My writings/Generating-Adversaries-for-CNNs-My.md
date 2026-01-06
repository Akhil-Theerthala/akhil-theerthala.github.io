## Part-1: Getting the model to misclassify.
Well, now that he verified the functionality of the model. He stwondered“ **What is a possible way to avoid the model detecting the image as a cat?**”
There are many ways in which he can do that. He was confused. Feeling confused, he sought his friend’s opinion..
_“There are many ways we can do that. However, the simplest approach would be to add noise to the image.”_
His friend explained as follows,
_“ The only thing the model sees is a matrix of numbers. It makes a few computations using the entries of the matrix. If we slightly manipulate the numbers, we can find a way to manipulate the results.”_ _“However, we need to ensure that the image still looks like the original to the human eye. So, let us restrict the manipulations to a range. Say (_**_ϵ_**_, -_**_ϵ_**_). “_
After getting some direction, Robert returned to his room and started coding.
So, essentially, he was trying to change the array entries by a slight amount, i.e., the manipulations must lay within a range ( **ϵ**, — **ϵ**) where **ϵ** is a small value. But what noise should we use to manipulate these computations?
Okay. He had found a direction. He needs to manipulate the array values so that the final probability values get manipulated. But the model should also not detect all the cats as goldfish. Hence, the changes should be minute.
Here is a code snippet in PyTorch that he used.
```
noise = torch.zeros_like(cat_tensor, requires_grad=True)
opt = optim.SGD([noise], lr=1e-1)
epsilon = 2./255
for t in range(30): 
    pred = model(norm(cat_tensor + delta))
    loss = -nn.CrossEntropyLoss()(pred, torch.LongTensor([341]))
    if t % 5 == 0:
        print(t, loss.item())
    opt.zero_grad()
    loss.backward()
    opt.step()
    delta.data.clamp_(-epsilon, epsilon)
```
He got the following trend in the loss values with the above code.
![](https://miro.medium.com/v2/resize:fit:400/0*nZQLKxZGWWtTpS6N.png)
Finally, the actual probability of the original class, the “cat”, for the manipulated image is 1.49\* 10–8. Whereas the probability predicted for the original image is ~0.996. The following is the image of the final noise:
![](https://miro.medium.com/v2/resize:fit:822/0*ZG2nbNZ-blUzGSjl.png)
He looked into the results. The model is now predicting his cat as a chihuahua. It had a probability of 0.99998.
## Part-2: Forcing the model to detect the image as a goldfish.
He understood what he needed to do by looking at the earlier code. He only needed to manipulate the loss function. If he did that, then his work would be complete.
“How should I manipulate the loss?” Robert thought. Earlier, he only tried to increase the error between the prediction and the original target. After a few minutes, he found that he should also minimize the error between the model’s predictions and the target label for “goldfish”.
Hence, he changed the optimization step slightly.
```
loss = (-nn.CrossEntropyLoss()(pred, torch.LongTensor([248])) + nn.CrossEntropyLoss()(pred, torch.LongTensor([1])))
```
He trained the model with the new loss function. After training for 30 epochs, he wasn’t satisfied with his results. Hence, he trained for a more significant number of epochs.
Now, he saw the final result:
```
max_class = pred.max(dim=1)[1].item()
print("Predicted class: ", imagenet_classes[max_class])
print("Predicted probability:", nn.Softmax(dim=1)(pred)[0,max_class].item())
```
Which gives the output:
```
Predicted class: goldfish 
Predicted probability: 0.9999934434890747
```
After seeing the result, he was satisfied. Slowly he became curious. He wanted to see if the noise added to the image had any patterns. Hence, he plotted the noise using `plt.imshow`.
Here is what the noise looked like:
![](https://miro.medium.com/v2/resize:fit:818/0*WOvUO4XfTKklZhv5.png)
He didn’t notice any specific patterns naked to the human eye. He wanted to investigate more. However, he remembered that he only had a day before he would be fined for not registering his pet. Hence, he finally decided to take a step back, compare the manipulated image with the original image and finally submit it.
![](https://miro.medium.com/v2/resize:fit:1400/0*MKpRq79zlEEROkYx.png)
He sighed with relief. He didn’t notice any differences between the two images. However, he was filled with fear and guilt. He didn’t want to get in trouble. The only thought that remained in his mind was, “What should I do if I get busted?”
After thinking a lot for a day, it was evening 4 PM on the final day. He reluctantly filled in all his application details and uploaded the image. However, right before he clicked submit, he got a call.
In normal cases, he wouldn’t have lifted the call. However, he doubted the weird coincidence. He slowly lifted the call.
“Congratulations Robert. We welcome you to join our team.” A female voice buzzed through the speaker.
“Team? May I know what this is about?”
“This is about the role of ML Engineer that you interviewed for last month. I have mailed you your package details and the offer intent letter. Could you sign it and send me a confirmation mail?”
“…” He was confused. After getting rejected by countless companies, he finally bagged a job. He was in disbelief.
“Robert?”
“Oh. Yeah. Thanks a lot for the call. I will send the signed copy soon.” Robert replied fast and cut the call.
He screamed in happiness. After settling down, he looked at his computer screen. He laughed for a few seconds, uploaded the original image instead of the manipulated one, and submitted the application.
After submitting it, he thought about what he had done for the past few days. He suddenly felt embarrassed about the way he thought. “Why did I think like that? The world doesn’t even revolve around me. “
He wanted to cry when he recalled his thoughts about getting busted and other idiotic stories he had built up. This story is something he is never going to share with anyone. Clearing his mind, he slowly walked out of his room, excited about the future.
This is a brief and simple example to generate adversarial examples. I initially didn’t want to try this story-based approach until I got better at writing. But I had to start somewhere. I hope you found it fun. I know that Robert is not a clear and fleshed-out character. I wanted to do it in a better way too. But I think my future characters and settings will be a bit better.
There are far more advanced techniques that give better and more stealthy results. Approaches that use different methods like fault injection, ones that depend upon the faults inherent in the hardware, etc. The field of Adversarial Machine learning is rapidly increasing, and its importance will keep rising over time as more and more companies try to incorporate ML models in their products.