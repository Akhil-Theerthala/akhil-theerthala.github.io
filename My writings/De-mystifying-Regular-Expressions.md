## One of the most underrated skills any data professional should have when working with strings
RegEx is one of the most powerful text-related skills out there; however, it's equally frustrating to learn. We come across the applications of RegEx, some of its notable uses include syntax highlighting in IDEs, and routing in web applications, among others etc. It is also prominent in the fields that involve processing huge chunks of data, like Data validation, Web Scraping, Data Mining etc.
![Example of syntax highlighting. Photo by Mika Baumeister / Unsplash](https://miro.medium.com/v2/resize:fit:1400/0*QXEQDCzIWKXGksGi)
However, it is equally frustrating to understand it when we try to learn it academically. It is more comfortable when we learn it through an example. However, the example must be simple yet versatile enough to cover different features and the facilities Regex offers. After much thought, I realised that a simple example like today's date could cover most of the RegEx concepts I use in my projects. _(Well…I was looking for an example while looking at my phone, but I guess this counts as trying.)_
So, in this article, we will explore the different operators of Regular Expressions while we try and match this Sunday, 23 July 2023.
## Searching directly
One of the simplest ways to search a string is to search for the string directly. In practice, you can do this by `re.search('23 July 2023')`. However, not all programming languages use this kind of notation. For example, in javascript, we represent regex patterns using the literals or the forward slash character `/`. This is how the patterns are also generally represented in the literature too. Hence, for uniformity, we will use the forward slash notation throughout the article.Now, when searching directly, we represent it by `/23 July 2023/`.
Directly searching for `/23 July 2023/`returns all the matches with the date in this exact format. However, as previously mentioned, dates are generally have countless variations. The same date can be written as `23 jul 2023` ;`23 july 2023` ;`23/07/2023` or even `23/07/23`. How can we adapt our search to include all these different date formats?
## Increasing the scope of the search
Now, the search scope in our example needs to be narrower. However, these broad examples can be condensed into two representations. The word representations `23 July 2023` and the numeric representation `23/07/2023`. Two different expressions can match these two different strings. First, let's try to get an expression matching these two representations.
### The disjunction operator (|):
We need to specify where the pattern can be varied to include these different text formats. Let's first specify the variation between two variations, `23 July 2023` and `23/07/2023`. This can be specified using the **disjunction**`|` operator.
The disjunction operator enables us to match two or more expressions in a single query. Hence, our original expression changes to the following expression,
`/23 July 2023|23/07/2023/`
Upon seeing this, you might think, "Wait! There is something wrong with the earlier notation! The / is used multiple times in the string. Doesn't the representation get confusing?" If you did think that way, then you are right. This is not how the special characters `/` are represented in Regex. These special characters include. `*,$, ^, +,(,), {, }, [, ] and .`, among many other things that will be introduced later.
We typically add these into the expression using an escape character, which is generally a backslash(`\`). Hence, the correct expression changes to,
`/23 July 2023|23\/07\/2023/`
Looks confusing. However, these are the few things we must tolerate when writing such expressions.
> _Note that in some situations, the \\ can be considered as a part of the string. Hence you might need to use a \\ as an escape sequence. This is generally not that prominent, but I thought it is better to mention this._
### The “\[ \]”:
Now that we have the pattern to match two forms, i.e. numeric and textual forms of date, you might think you can relax. But there are still a lot of varieties to consider. Take your time to ponder about a few of these variations.
Let's start with simple things; people might write `July` without a capital `J` or they might use a hyphen (-) or a period (.) instead of a slash. Now, how do we make these considerations in the pattern? We can't just add all these representations by using the disjunction operator. (That takes too long when searching for complex patterns; honestly, it's just a lot of work.).
That's when the `[]` come into play. This operator considers whatever the characters or expressions in it as a sequence of `OR` probabilities. For example, when we mention `/[ab]c/` the system searches for either `ac` or `bc`. This is useful for us to mention these different forms of representation. Hence, our new expression comes to,
`/23 [Jj]uly 2023|23[-\/\.]07[-\/\.]2023/`
> _Note that we have represented the period (_ `_._` _) as_ `_\._`_. As it is one of those special characters mentioned previously._
Now this representation considers `23 July 2023, 23 july 2023, 23/07/2023, 23-07-2023, 23.07.2023`. Now, you can step back and relax before continuing the journey.
## Optional characters
Now in the final set of representations, we have covered the two variations of the word `July` and different ways of writing the numerical format of the date. But there are more variations of writing a date. You can find multiple variations when we think for a few seconds. However, let's take some baby steps and start with the next simplest variation.
### The `?` operator
In our case, the next simplest representation is the one where we represent `July` without the `y`. `23 Jul 2023` is also a valid way of writing the date. Hence, we need to add that to our representations too. So how do we do that?
This is where the `?` comes into play. Using the `?` operator immediately after a character indicates that the character might or might not occur in the pattern. This simple use case can be very powerful when combined with the previous operators and another operator we will look into shortly. We will look into these examples later on. For now, let's update our expression,
`/23 [Jj]uly? 2023|23[-\/\.]07[-\/\.]2023/`
![Become a member](https://miro.medium.com/v2/da:true/resize:fit:0/60026f4340686a391639ac58864da18070aa773cea45de6e55fa47fd56bfdb74)
![Become a member](https://miro.medium.com/v2/da:true/resize:fit:0/c061bd6cb52734164bf0c66f2543a6bc2acbe24ae3985dc15c898b3ddb2e1940)
](https://medium.com/plans?source=upgrade_membership---post_li_non_moc_upsell--4faa3207143---------------------------------------)
This simple change adds two representations to our collection, expanding our search scope. However, there are still things that can be done.
### The parenthesis
The next simplest representation that can be added is the optional occurrence of the `20` in the `2023`. So how do we do that? Do we add two question marks after 2 and 0? That can be done for simple things like this. However, what would you do with multiple sets of characters that might not occur, such as plurals like puppy and puppies? Do you add `?` after all the optional characters like `puppy?i?e?s?` This increases the chances of including things like the puppet or sometimes misspelled words like puppi. Using disjunction is also not a valid choice as `puppy|ies` represents `puppy` or `ies` not `puppy` or `puppies`.
Let's simplify this problem. What we need is the ability to group different characters into one block. (_This can help concatenate our current expression, too!_). Now, this is what the parenthesis operator provides us. We can group multiple characters into a block by placing them in parenthesis. Hence, `(20)?23` can match either 2023 or 23. This changes our expression to
`/23 [Jj]uly? (20)?23|23[-\/\.]07[-\/\.](20)23/`
However, we can use the parenthesis further to shorten our entire expression, as the major difference between the two representations is how we write the month. Hence, our new expression becomes,
`/23( [Jj]uly? |[-\/\.]07[-\/\.])(20)?23/`
> _Take note that in our shortened expression there is no space around the parenthesis but rather it is located around the text July. If we keep the spaces outside the parenthesis, then our pattern becomes something like this_ `_23 /07/ 2023_` _instead of_ `_23/07/2023_`_._
This is not the end, as we haven't considered variations like `23-Jul-2023` or `23-Jul-23`. However, with the understanding you've gained so far, I encourage you to tweak the existing regex pattern to accommodate these forms. Give it a shot before continuing with the article.
## Specifying the position
Now that we have the expression to match the dates, it is time to take the next step. However, it is important to note that the expression from the above pattern includes multiple items we don't need. Some of these include situations where we might come across a few cases where the 23 might belong to a different statement and the `July 23` or `July 2023`. Hence, it is important to include the position information in our expression.
### How do we add this information?
In RegEx, we use a few specified notations called Position Anchors to indicate this position. Some of the common ones include `^,\b,\B,$`. Each of these has a specific use case, which is mentioned in the table below,
![Anchors and their definitions. Image owned by Author.](https://miro.medium.com/v2/resize:fit:1400/1*5CxPX8qjJS5JB9oWHHKWNw.png)
Among these, the word boundary is the most useful for us, as it enables the "whole words only" search mode in RegEx. This filters most confusion from the picture when we push July into the parenthesis. Hence, our pattern changes to,
`/\b23[ \.\/-]([Jj]uly?|07)[ \.\/-](20)?23\b/`
This is used because we might encounter situations with punctuation before or after the date, and we don't want to exclude them. You can try these out and see whether the punctuations occur or not. (If you do, you will be in for a surprise!)
## The issue in our pattern!
Let's delve deeper into a common issue we might face with our pattern. Suppose you try running the above pattern with Python's `re.findall()` function using a sequence such as "Today is 23 July 2023". Here's what happens::
![Output from using the earlier regex pattern in Python’s re.findall() function. Image generated by the Author.](https://miro.medium.com/v2/resize:fit:1128/0*TdOjFTmUnvVZ3thN.png)
Output from using the earlier regex pattern in Python's `re.findall()` function. Image generated by the Author.
Well, what do we see here? We see that the pattern we mention only returns the results of the expressions in the parenthesis. Why is that?
This is because Regex has a simple application called **substitution**. In substitution, we generally tend to group a pattern in the text and store it for reference with a numbered indicator to call it later on in the pattern. This helps us keep our pattern simple and not use the same expression again and again. These groups are generally called **capturing groups.**
However, these things also interfere when the parenthesis is used for normal pattern searching. Hence, we only need to mention to the system that these things are not meant to be stored. How can we do this? We add `?:` the beginning of the expression in the parenthesis. These kinds of groups are called **non-capturing groups.** Hence, our pattern changes slightly,
`/\b23[ \.\/-](?:[Jj]uly?|07)[ \.\/-](?:20)?23\b/`
This gives us the output we need. You can check the output we get now,
![](https://miro.medium.com/v2/resize:fit:1240/0*rjNjDyZAZoIpKX6_.png)
With this, we have covered most of the common operators in RegEx, and you can go ahead and try to identify different patterns using what we have discussed today. However, before we leave, I will present all the operators we discussed today for quick reference, along with a few others we didn't get a chance to do so.
![A table describing basic RegEx operators and their definitions. Image created by Author.](https://miro.medium.com/v2/resize:fit:1400/1*AqknDD3NnEbT-6rKTLkPDQ.png)
The above table can be a simple reference for most regex operators. You can see that some of these operators have multiple uses based on the position they are used in, so it is especially important to check the use and effect of these operators when writing an expression.
I hope you enjoyed reading this article. I also post relevant information on [Instagram](https://instagram.com/neuro_nuts) or [LinkedIn](https://linkedin.com/company/neuronuts) so you can follow us there. Or you could sign up to this site to get a mail whenever I release an article!
### [WRITER at MLearning.ai](https://mlearning.substack.com/about) // [Control AI Video](https://open.substack.com/pub/mlearning/p/ultimate-guide-fully-control-ai-video-generation?r=z7zu8&utm_campaign=post&utm_medium=web) 🗿[/imagine AI 3D Models](https://open.substack.com/pub/mlearning/p/image-to-3d-one-click-ai-tool-modeling-video-txt?r=z7zu8&utm_campaign=post&utm_medium=web)