# XML Memorial

This is the memorial for XML. Many have tried to make it work. Most have failed. If you follow the steps described in the setup description you will have the knowledge to succeed. But since no one reads past the word "setup description" it is very unlikely you will succeed. It is way more likely that you will ask ChatGPT. And ChatGPT uses statistical methods to calculate the answer with the highest probability to succeed. Unfortunately XML is very strict and not statistically flexibel at all.

XML was created back in a time when computer scientists had actual jobs and did not spend more than ten minutes to write an introduction to a basically self explanatory repository. That is sad. It is not sad that everyone is now a computer scientist. It is sad, that we believe that this was necessary. Why would we make the SVG format touring complete? Who would ever use a `while(true)` loop in a picture? How come we think it is fine to accept the possible downside of embedding a key logger into a computer graphic just to make a pink unicorn puke rainbows? And why would CSS be touring complete as well? Why is it, that we will start implementing AI models into quantum computing algorithms developed with Quantum-JavaScript before even understanding what it is we actually want? And why am i asking these questions in a README.md? Please answer in a comment on my youtube channel if you find it.

*"We never forget. We never forgive. Expect us."*


## Setup Description

1. Install [node.js](https://nodejs.org/en)
2. Clone repository
3. Go to repository folder
4. Open Command line by typing `cmd` into your explorer search bar
5. Enter the magic words `npm install`
6. Watch the funny command line output saying that there was a lot of things done and installed that you have no clue what it means
7. Enter the magic words `npm start`
8. Open a browser and enter [`localhost:1337/asset.xml`](http://localhost:1337/asset.xml)
9. Congratulations, you are now a hackerman, now go out into the wild and make autistic remarks at how sad our life and how morally twisted our society is


## XPath information

To select single nodes you can select them using xpath.

For example to select the first trade of a specific asset you can use the XPath-selector:
> `/asset/trades/trade[1]`

And to select the last trade you use this:
> `/asset/trades/trade[last()]`

To select an acquisition worth more than 48340 you can use this:
> `/asset/trades/trade/acquisition[price > 48340]`

To navigate from an acquisition to its parent `trade` node you can use:
> `/asset/trades/trade/acquisition[price > 48340]/..`

To get back to the `title` node from acquisition you can just slash back down like this:
> `/asset/trades/trade/acquisition/../../../title`

To get all the acquisitions that cost more money than 5k" you can do this:
> `//acquisition[price > 5000]`

If you do not know the nodes name that you need the price of you can do this:
> `//..[price > 5000]`

If you look for an attribute like `id` you can use this:
> `//trade[@id = 'eeff0001']`

