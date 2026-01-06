## The Borrower, the Lender, and the Transformer: A Simple Look at Attention
It’s been 5 years…and the Transformer architecture seems almost untouchable. During all this time, there was no significant change in the structure behind a transformer. However, the world, for sure, has changed a lot because of it. We are now seeing amazing things achieved with this architecture. Starting from having simple conversations, to now controlling the device settings, everything was made possible by the same design.
![Transformer Architecture. Source: “Attention is all you need.”](https://miro.medium.com/v2/resize:fit:504/1*c-h_uHNX5vYNp_RInSiUSA.png)
**_What’s the reason? Why does this architecture almost always work for anything?_**
This was the question I had every time I used this architecture. I knew what attention was, I knew the basic idea behind this, but almost always the answer seemed to elude me. That’s when it hit me that the understanding I have was not enough. Through this article series, I plan to re-learn each and every aspect again from scratch. Trying to understand this better.
## Attention Mechanism
It’s now almost undeniable that the core advantage of a transformer comes from the so-called “Attention” mechanism. Almost all the articles introducing attention, refer back to the same machine translation [paper from 2014](https://arxiv.org/pdf/1409.0473.pdf). (_P.S. It’s funny how this is referred to as a TV Show by Google._)
![The paper being referred to as TV program by google.](https://miro.medium.com/v2/resize:fit:616/1*sGJRtgIRH-oXkT9nAEiQcg.png)
The core idea that the paper presented was simple, since RNNs fail to keep remembering the long-term context, they suggested to add the context somewhere else, so that we can refer back to it when needed. Well, that’s what we do too. We note things down because we almost always can’t remember everything.
During the lecture: “CS-25-V2: Introduction to Transformers”, _Andrej Karpathy_ shared a few comments behind the person’s perspective. It was stated that the author, who was learning to speak English, almost always referred back to the previous words to understand the contextual meaning. Later on, that’s what led to the attention mechanism and transformer. Simple enough, right?
You can understand “Why” the attention mechanism is needed. However, the most troubling part for me was always the “How”. It’s always this equation:
![Equation for Attention](https://miro.medium.com/v2/resize:fit:610/1*3g_1RWaF3up6eRdjzbG8_g.png)
You find some “affinity” between the **Q** (query) and **K**(Key) and then get a SoftMax from it, finally projecting the **V** (value) on it. You somehow get the context vector. The simple explanation of “looking back to remember the context” is now an equation. However, most of the discussions still explain this either from the perspective of the database or from the perspective of the model.
However, what finally made me understand was the interpretation given by _Andrej Karpathy_, in the earlier mentioned lecture. In this he mentioned that he wants to interpret the attention mechanism like a conversation phase of the transformer. Inspired from that interpretation, I realised that this is also what happens when someone is trying to borrow money. Hence came this article.
## My narrative.
Before we go into the narrative, let’s set the setting. We have two people, _A_ and _B_. The place they live in trades using coins. Because of some situations, A now needs 500 more coins than the 416 coins he has to buy his favourite phone. B, however, has saved 1000 coins.
![Scene setting. Source: Me!](https://miro.medium.com/v2/resize:fit:698/1*fED04wFbSCbep90r9qJsnw.png)
Now based on the setting, we can know that B can give twice the required amount of A. As in, A’s chances of getting 500 coins from B are 2.
However, as data scientists, we speak probabilities. Hence, A’s probability of getting his needs satisfied from B = 2/2 =1.
However, reality is not as beautiful. A and B are practically strangers. Hence B can at most give A 100 coins. Now, how much money can A expect?
![1 times Amount b is willing to give, which is nothing but 100 coins.](https://miro.medium.com/v2/resize:fit:1352/1*0qjMtuQ2Om0n--R-CmJ-lA.png)
After the expected amount, A now has 500 coins.
Now, let’s complicate the scene. A also has a friend C, who saved 250 coins, and is willing to give A 150 coins.
![Updated Scene setting A new person enters the picture. Source: Me!](https://miro.medium.com/v2/resize:fit:956/1*S2tbdrwx1GXUi09hmzSY8w.png)
Now, A’s chances to get his goal satisfied with the help of C is 0.5 and the probability of A’s goals being met from B and C are,
![](https://miro.medium.com/v2/resize:fit:602/1*4II6ewAhxHQb-wAEJHarJQ.png)
![](https://miro.medium.com/v2/resize:fit:942/1*OiRwyyJK_bbHbEd3gwJgtw.png)
## How is this even relevant to the Attention mechanism?
Well…replace the persons with words. The coins with the context bank of each word. The “context bank” of a word is nothing but the contribution of a word to the meaning of the sentence. This finally makes the amount each person is willing to give be the additional context that we add to the word.
If you don’t want to speak about words, then we can also relate this to the images.
-   Coins A wants → Additional information about the image patch.
-   Coins B, C has → Contextual information that is relevant to the image.
-   Coins A additionally gets → Additional context of the image obtained from the other patches.
![](https://miro.medium.com/v2/resize:fit:1096/1*62lVMfYLNokbLL6Z1WcA3Q.png)
Now going back to the original Q,K,V terms,
![Original and narrative based explanations for Q,K,V.](https://miro.medium.com/v2/resize:fit:1400/1*sZ3r9kQH8U-9bGRAzEkJ2Q.png)
## How does the model get these Q, K,V? These aren’t made manually, right?
The goal of having a model in itself is to avoid manual processing. Hence there is no way these 3 are made manually. (_You can work on it if you want, but it’s a very laborious task_). We instead try to get these from the inputs itself. To do this, we define 3 different weights, (query\_weights, key\_weights, value\_weights), and let the model iteratively obtain weights.
The following image finally explains what happens in attention:
![Inside an attention block.](https://miro.medium.com/v2/resize:fit:1400/1*KU9aOEKnXnZswrcycqtmvQ.png)
That concludes my interpretation of attention. Of course, this is not the end. There is still much to discuss, like Multi-head Attention, Cross Attention, Global Attention, Soft attention, etc. However, what we discussed in this article is the basic building block. Whatever forms there are just obtained by changing a few details of the attention mechanism we discussed.
If you want to get updates on these, feel free to give me a follow! Also, you can check out my other articles on my [site](https://www.dao-of-data.com/).
## References
1.  “Attention is all you need” Paper. [Link](https://arxiv.org/abs/1706.03762).
2.  CS-25 Transformers United: V2 Introduction to Transformers. [Link](https://www.youtube.com/watch?v=XfpMkf4rD6E).
3.  Chapter-11,Dive into Deep Learning book. [Link](https://d2l.ai/chapter_attention-mechanisms-and-transformers/index.html).
4.  Stack Exchange Discussion regarding key, value and queries. [Link](https://stats.stackexchange.com/questions/421935/what-exactly-are-keys-queries-and-values-in-attention-mechanisms).