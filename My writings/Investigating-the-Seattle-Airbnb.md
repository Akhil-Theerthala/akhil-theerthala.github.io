## About the dataset
This data is a part of the Airbnb Inside initiative and it describes the listing activity of homestays in Seattle. The data contains three different CSV files each about,
-   Information about the listings,
-   Reviews for each listing,
-   A Calendar file, containing the price and availability of a listing for each day over the span of an year.
It is very easy to understand the data as most of it is straightforward, and we can make good use of the visualizations provided by Airbnb, at this [link](http://insideairbnb.com/seattle/).
After looking at the visualizations provided by Airbnb, A few questions were raised in my mind which I had to explore using the dataset. Those are,
1.  What is the probable price for a room based on the neighborhood?
2.  Which are the common property types in each neighborhood, and what properties can be found in a neighborhood, more easily than others?
3.  What is the effect of selecting “Strict” cancellation policy on the frequency of bookings? Do people prefer the other listings over them, following our basic intuition, or will we see any twist?
4.  What is the neighborhood where the price is high despite providing minimum amenities?
Along with them, I had built a simple linear regression model that can predict the prices of the listings, based on multiple parameters. Since the questions I had were not relevant to the host details and other small details, I have excluded them from the analysis.
The neighborhood values had a lot of processing needed, fortunately, the **‘neighbourhood\_group\_cleansed’** column, which contains the neighborhoods grouped under common names was provided in the dataset.
### **Q. What is the probable price for a room based on the neighborhood?**
For this, first, I wanted to know the actual distribution of the prices irrespective of the neighborhoods.
![](https://miro.medium.com/v2/resize:fit:572/1*ERzeANQSKpQQX90Ht6uTjQ.png)
From the boxplot, we can see that most of the listings in Seattle have their prices in the range of $84 to $133. We can also observe some outliers, where the price per day is very high, for example, we have a listing with a price of $415 per day.
![Become a member](https://miro.medium.com/v2/da:true/resize:fit:0/60026f4340686a391639ac58864da18070aa773cea45de6e55fa47fd56bfdb74)
![Become a member](https://miro.medium.com/v2/da:true/resize:fit:0/c061bd6cb52734164bf0c66f2543a6bc2acbe24ae3985dc15c898b3ddb2e1940)
](https://medium.com/plans?source=upgrade_membership---post_li_non_moc_upsell--dd564fa30ab8---------------------------------------)
This provides useful information, but what I wanted was the neighborhood based price distributions. Which I obtained using the following boxplot.
![](https://miro.medium.com/v2/resize:fit:1400/1*nauJndNBp24OxzvGyQXNMQ.png)
In that we can see that the prices were completely different depending on the neighborhood group a listing is in, with the overall prices of listings in **‘Magnolia’** higher than the rest of the groups. The entire distribution is added to an interactive chart using plotly.
![](https://miro.medium.com/v2/resize:fit:1400/1*GGDfxyFSTRYzK9Qw2h7j5A.png)
### Q. Which are the common property types in each neighborhood, and what properties can be found in a neighborhood, more easily than others?
After getting the price distribution over a neighborhood, I automatically wandered to the next question, what are the property distributions among the neighborhoods. This is what I got,
![](https://miro.medium.com/v2/resize:fit:1400/1*JjxB1ZT4pnRLxhcewsiGpA.png)
In all the neighborhoods, the **most** _common_ types of listings are **House, Apartment**, except for “**Downtown”**, where most of the listings are apartments. Following the House and apartment listings, the next more common kind are the **“Townhouse”** listings, which can be found in **Beacon Hill, Delridge, Central Area, Magnolia**.
In **Interbay**, the “**Loft”** listings can be said as more frequent than the remaining neighborhoods.
### Q. What is the effect of selecting “Strict” cancellation policy on the frequency of bookings? Do people prefer the other listings over them, following our basic intuition, or will we see any twist?
Simliar to earlier questions, I tried to get a bar distribution separated by colour for each neighbourhood.
![](https://miro.medium.com/v2/resize:fit:1400/1*wnhqo-r-qCakpQ5k2CXyag.png)
The first few observations where the _flexible/moderate_ had relatively more bookings than the listings with _strict_ cancellation policy. But, there are some neighborhood groups, where the situation is reversed, for example in **Seward park**, where the listings with the strict cancellation policy are booked for more than 6 months, while the listings with flexible are booked for ~2 to 3 months.
This might be acceptable, as the cancellation policy is not solely responsible for booking a stay, but feel free to comment any reason that you find in this.
### Q. What is the neighborhood where the price is high despite providing minimum amenities?
This was interesting, as for most of the neighborhood groups, there were listings without offering any amenities. These listings vary from an apartment, boat to a simple tent or a tree house. The info is displayed in the following visualization,
![](https://miro.medium.com/v2/resize:fit:1400/1*75UI0NvjJYwql9TQo9qQiA.png)
Since we only needed a high price, the data was extracted and displayed in the following table,
![](https://miro.medium.com/v2/resize:fit:488/1*G1z8H-U7vSrJAzpdXHNn-w.png)
In the above table, the tent was not provided, as only one tent was listed with a price of $25.00.
### The model to predict the price based on different features.
Now after doing all this, the only thing left was building the model that can predict the prices. Since we only need a rough estimate before booking a listing based on our features, a linear regression model would fit the purpose.
![](https://miro.medium.com/v2/resize:fit:1400/1*K7cW41QLbfXBqs4W1n7HRg.png)
After training the model, the predictions were evaluated, and were found to be a rough estimate for the prices in range ($0,$400). But when we go back to our first question, where we wanted to know about the price distributions, we can find that most of the prices lie in the range of $83 to $133, with the maximum fence at $204.50. These lie in the sane range of our model, hence we can conclude tuning our model.
This doesn’t mean we can’t get a better model. Improvement to this model could be done, as some of the features were excluded, like the effects of the host being a superhost, or the effect of reviews per month, or even fine-tuning the outliers for each individual column available.
## Conclusion
During this exploration, the questions were revisited multiple times and refined to reach a state where they are meaningful.
During the exploration, I have tried exploring the reasons for each observation. The complete details and code that I used for the observations are available in my GitHub repository [here](https://github.com/Akhil-Theerthala/Seattle-Airbnb-Analysis). Since some of the visualizations are done using Plotly, the notebook is better viewed [here](https://nbviewer.org/github/Akhil-Theerthala/Seattle-Airbnb-Analysis/blob/main/analysis.ipynb).