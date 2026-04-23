export const STOPS = [
  {
    id: 1,
    name: "Central Station",
    lat: 52.3791,
    lng: 4.9003,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Amsterdam_Centraal_2016-09-13.jpg/960px-Amsterdam_Centraal_2016-09-13.jpg",
    sections: [
      {
        key: 'introduction',
        title: 'Introduction',
        text: `Welcome to Amsterdam Central Station.\n\nBefore you go anywhere, understand one thing: you are standing in water. Not next to it, not near it — in it. We built this entire station in a river.\n\nMost cities begin with solid ground and build from there. We looked at a swamp where rivers met the sea, flooded regularly, and thought: yes, let's build a city here.\n\nMoving somewhere easier would have been the logical choice. We don't always choose logical when stubborn is available.\n\nSo we drained land, pushed back water, drove millions of wooden piles into the mud, and slowly created something that feels like ground.\n\nThen, just to prove a point, we built our main train station right on top of it. Because if you're going to ignore common sense, you may as well commit properly.\n\nAmsterdam does not exist because it was a good idea. It exists because we refused to leave.`,
      },
      {
        key: 'historical',
        title: 'Historical context',
        text: `Central Station opened in 1889, during a period when Amsterdam was modernizing rapidly.\n\nRailways were transforming Europe, and Amsterdam needed a central terminal connected to national and international routes. The challenge was location: the medieval city center was already dense, while the waterfront offered direct access but no solid ground.\n\nSo engineers reclaimed land in the IJ and created a new platform for the station. Thousands of timber piles were driven into the soil below to carry the weight above — the same principle used throughout Amsterdam.\n\nThe station was designed by Pierre Cuypers, who also designed the Rijksmuseum. His work helped define the architectural image of late 19th-century Amsterdam.\n\nBuilding the station also changed the city permanently. For centuries, Amsterdam faced the water directly. After 1889, the station became the new front door of the city.`,
      },
      {
        key: 'anecdotes',
        title: 'Local anecdotes',
        text: `When the station was first proposed, many Amsterdammers hated the plan.\n\nNot mildly disliked. Hated it.\n\nUntil then, the city opened straight onto the harbor. Ships arrived visibly at the edge of town. Trade, movement, noise, opportunity — the water was part of daily life.\n\nThen someone proposed placing a giant building in front of it. Locals complained it would block the view, damage commerce, and ruin the character of the city.\n\nReasonable concerns. We ignored them. The station was built anyway. And now try to imagine Amsterdam without it.\n\nExactly.\n\nThis happens here more often than you'd think:\n\nFirst we protest. Then we adjust. Then we defend the thing we protested.`,
      },
      {
        key: 'highlights',
        title: 'Neighborhood highlights',
        text: `Facing Central Station, opposite the building at the main intersection stands the Victoria Hotel, opened in 1890.\n\nLook closely at its façade and you'll notice two smaller historic houses still embedded within the larger structure. Developers wanted the full plot, but the owners refused to sell. So the hotel was built around them.\n\nTo one side of the square, trams move continuously through Stationsplein. To the other side, ferries cross the IJ toward Amsterdam North.\n\nThis is one of the clearest examples of Amsterdam in one view: historic buildings, modern transport, compromise, and constant motion.`,
      },
      {
        key: 'food',
        title: 'Food and Drinks',
        text: `Near Central Station, a few dependable places stand out.\n\nFor a quick Dutch classic, FEBO (Nieuwendijk 50) serves hot snacks from vending windows. Coins in, snack out. Efficient.\n\nFor an old-school brown café, Café Karpershoek (Martelaarsgracht 2) is one of the oldest bars in the city and has been serving drinks for centuries.\n\nFor coffee and a calmer atmosphere, De Koffieschenkerij (Oudezijds Voorburgwal 27) sits in a quiet courtyard near the Oude Kerk.\n\nBusy area, plenty of traffic — but good stops are close.`,
      },
      {
        key: 'next',
        title: "What's next",
        text: `From Central Station, head toward Dam Square along the broad avenue leading into the center.\n\nThis route was designed to connect the new railway station with the old heart of the city: wide, direct, and impossible to miss.\n\nIn just a few minutes, you'll arrive at the place where Amsterdam began.\n\nNot with a palace.\n\nWith a practical solution.`,
      },
    ],
    routeImage: "https://app.billsbiketour.com/wp-content/uploads/2025/11/Screenshot-2025-11-02-at-8.36.56-PM.png",
    routeMapsUrl: "https://www.google.com/maps/d/viewer?mid=1hTQZX1Q-4Oi3YPg4bJnLK9dAYkF9n34",
    get narrative() { return this.sections[0].text; },
  },
  {
    id: 2,
    name: "Dam Square",
    lat: 52.3730,
    lng: 4.8933,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Dam_Square_2024.jpg/960px-Dam_Square_2024.jpg",
    sections: [
      {
        key: 'introduction',
        title: 'Introduction',
        text: `Welcome to Dam Square. And yes — it's called Dam Square because… it's a dam.\n\nWe're very creative with names. You're in AmsterDAM, in the NETHERlands, standing on a dam that controls the water.\n\nClear. Efficient. No confusion.\n\nA few centuries ago, getting directions wrong here could have consequences. "Let's meet somewhere over there." Excellent plan. Enjoy drowning.\n\nSo we built a dam across the river, controlled the water, and created dry land. Problem solved.\n\nAnd because we never waste a useful solution, we turned it into business. Ships arrived, goods were unloaded, traders gathered, and money followed quickly.\n\nSuddenly this wasn't just a dam anymore. It was a profitable idea.\n\nWe did not build a city here first. We solved a problem… and sold it.`,
      },
      {
        key: 'historical',
        title: 'Historical context',
        text: `Dam Square exists because of a practical decision made in the 13th century.\n\nThe river Amstel flowed into a tidal inlet here. By building a dam across the river, we could control water levels, create a crossing point, and connect both sides of the settlement.\n\nThat one intervention changed everything.\n\nThe dam made movement easier, trade safer, and settlement more stable. Markets formed around it, houses followed, and Amsterdam began to grow around infrastructure rather than around a castle or cathedral.\n\nOver the centuries, the square changed shape many times. Buildings were replaced, canals filled in, traffic reorganized, and the open space expanded.\n\nThe most dominant building today, the Royal Palace, began life as the city hall in the 17th century. That alone tells you something important:\n\nWhen Amsterdam became powerful, we first built administration.\n\nKings came later.`,
      },
      {
        key: 'anecdotes',
        title: 'Local anecdotes',
        text: `The building now called the Royal Palace was never meant to be a palace.\n\nIt was built as a city hall. A very large, very expensive, extremely confident city hall.\n\nBecause in the 1600s, Amsterdam was one of the richest cities in the world. Ships were returning with goods from across the globe, trade was booming, and modesty was briefly unavailable.\n\nSo we built ourselves a headquarters.\n\nThen along came Napoleon.\n\nHe took one look at the place and thought: "I'll have that." And just like that, the city hall became a royal palace.\n\nWhich is a wonderfully Dutch story. We didn't build a palace for a king. We built something so practical and impressive… that a king moved into our office.`,
      },
      {
        key: 'highlights',
        title: 'Neighborhood highlights',
        text: `Facing the square, the largest building is the Royal Palace. Its broad façade and classical symmetry were designed to project stability, wealth, and civic power.\n\nNext to it stands the Nieuwe Kerk, or New Church. Despite the name, it dates from the 15th century. In Amsterdam, "new" can be relative.\n\nNear the center of the square stands the National Monument, unveiled in 1956 to commemorate victims of the Second World War.\n\nThe square itself is unusually open compared with the rest of the old city. That openness reflects centuries of rebuilding and redesign.\n\nThis has always been a place where people gather: for trade, announcements, protest, celebration, or simply because everyone else is already here.`,
      },
      {
        key: 'food',
        title: 'Food and Drinks',
        text: `Dam Square itself is busy, but reliable options are close by.\n\nFor a historic brown café, Café Hoppe (Spui 18-20), established in 1670, is a classic Dutch stop a short walk away.\n\nFor apple pie and coffee, De Drie Graefjes (Eggertstraat 1) is well known and consistently popular.\n\nFor something quick and local, try Dutch herring from the stalls around the Damrak area — seasonal, but worth it when available.\n\nBest strategy here: step one or two streets away from the square. The crowds drop immediately, and the quality usually rises just as fast.`,
      },
      {
        key: 'next',
        title: "What's next",
        text: `From Dam Square, continue west toward the canal belt.\n\nThe broad central streets soon give way to narrower streets, bridges, and water. You're leaving the medieval trading core and entering the part of Amsterdam where wealth was organized into rows, canals, and brick façades.\n\nNext stop: Herengracht and Brouwersgracht.\n\nWhere profit became urban planning.`,
      },
    ],
    routeImage: "https://app.billsbiketour.com/wp-content/uploads/2025/11/Screenshot-2025-11-02-at-8.44.02-PM.png",
    routeMapsUrl: "https://www.google.com/maps/d/viewer?mid=13qhph7o0mQcVIM9mRAlbtjaQJkpaUsg",
    get narrative() { return this.sections[0].text; },
  },
  {
    id: 3,
    name: "Herengracht / Brouwersgracht",
    lat: 52.3785,
    lng: 4.8844,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Keizersgracht_Jul_2019.jpg/960px-Keizersgracht_Jul_2019.jpg",
    sections: [
      {
        key: 'introduction',
        title: 'Introduction',
        text: `Welcome to the canal belt.\n\nThis is where we stopped surviving and started making serious money. Look at the canal. It is not there to look pretty. It is there to move goods.\n\nShips arrived carrying spices, coffee, textiles, and other products worth absurd amounts of money at the time. So we built the city around that flow.\n\nThese buildings were not originally elegant homes. They were business machines. Narrow because of taxes, tall because storage pays, and leaning forward very deliberately.\n\nBecause if you hoist goods straight up, they swing. And when they swing into the façade, you lose product, break windows, and damage profits. So we tilted the buildings forward.\n\nProblem solved. Less damage. Less labor. More profit. This is not city design. It is a business model made out of bricks.`,
      },
      {
        key: 'historical',
        title: 'Historical context',
        text: `By the early 1600s, Amsterdam had a problem.\n\nA luxurious problem, but still a problem. Trade was exploding. Ships were arriving faster than the medieval city could handle. Goods needed storage, merchants needed offices, workers needed housing, and everyone wanted to live close to the money.\n\nSo we did what we usually do when reality becomes inconvenient: we redesigned it.\n\nThe canal belt was one of Europe's largest planned urban expansions of its time. New canals were dug, plots were measured, traffic was organized, water was managed, and space was created with almost suspicious efficiency.\n\nThat tells you something important about Dutch culture. When success creates chaos, we don't romanticize chaos. We make a spreadsheet.\n\nHerengracht became the prestigious address. Brouwersgracht became the productive one. Status on one side. Storage on the other.\n\nDifferent canals. Same obsession: make the system work.`,
      },
      {
        key: 'anecdotes',
        title: 'Local anecdotes',
        text: `People often say Dutch directness is rude.\n\nThat's because they meet it in conversation first.\n\nIts real origin is practical. Imagine running a city built on water, crowded with ships, cranes, warehouses, contracts, ropes, barrels, and people carrying expensive cargo. This is not the environment for vague communication. "Maybe move that thing slightly left-ish."\n\nNo.\n\nYou say: Move. Now. Left. Clear language saves time, money, fingers, and occasionally lives. That same habit survived into modern Dutch culture.\n\nThis is probably the only place on earth where yes means yes, no means no, and maybe means maybe. Whereas in most countries yes means maybe, maybe means probably not, and no means let's see, I could be persuaded.\n\nDe Herengracht is called the Gentlemen's Canal because this is where all the rich merchants resided and traded. The Brouwersgracht is called the Brewery's Canal because it housed most of Amsterdam's many beer breweries.\n\nKISS. Keep it simple, stupid.`,
      },
      {
        key: 'highlights',
        title: 'Neighborhood highlights',
        text: `This intersection is one of the most admired in the city for a reason.\n\nBrouwersgracht was once lined with breweries, warehouses, and workshops. Today it is calmer, but many historic warehouse façades remain.\n\nHerengracht became home to wealthy merchants and city regents. If one canal says money was made, the other says money was displayed.\n\nNearby, the Jordaan begins — originally a working-class district, now one of Amsterdam's most desirable neighborhoods.\n\nNotice the bridges, houseboats, and rows of hoisting beams above the façades. Even the beautiful details here usually began as something practical.\n\nVery Dutch.`,
      },
      {
        key: 'food',
        title: 'Food and Drinks',
        text: `You're in an excellent area for a break.\n\nFor famous apple pie, Winkel 43 (Noordermarkt 43) is nearby and worth it if the line is reasonable. If the line is ridiculous, congratulations — you've found something tourists read online.\n\nFor a proper brown café, Café Thijssen (Brouwersgracht 107) is a dependable local classic.\n\nFor canal-side charm, Papeneiland (Prinsengracht 2) offers coffee, pie, and centuries of atmosphere.\n\nPragmatic Dutch tip: The best terrace is often the one that is 80% full, not 100%.`,
      },
      {
        key: 'next',
        title: "What's next",
        text: `From here, continue toward the Anne Frank House area.\n\nYou're leaving the world of merchants, margins, and moving cargo. The streets become more residential, more intimate, more personal. Same city. Different story.\n\nNext stop: a place that reveals not how Amsterdam made money… but how people survived when everything else collapsed.`,
      },
    ],
    routeImage: "https://app.billsbiketour.com/wp-content/uploads/2025/11/Screenshot-2025-11-02-at-8.49.07-PM.png",
    routeMapsUrl: "https://www.google.com/maps/d/viewer?mid=1A826RjvxJGp2Tox9xMGJuZ7WnF_4BAg",
    get narrative() { return this.sections[0].text; },
  },
  {
    id: 4,
    name: "Anne Frank House",
    lat: 52.3752,
    lng: 4.8840,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Amsterdam_%28NL%29%2C_Anne-Frank-Huis_--_2015_--_7185.jpg/960px-Amsterdam_%28NL%29%2C_Anne-Frank-Huis_--_2015_--_7185.jpg",
    sections: [
      {
        key: 'introduction',
        title: 'Introduction',
        text: `Welcome to the Anne Frank House.\n\nNow do me a favor. Look at it. Really look at it. It's… nothing special, right? Same narrow house. Same bricks. Same windows. Same canal.\n\nIf I didn't tell you, you'd bike straight past it thinking: "Nice building. Next." And that's exactly the point.\n\nBecause during the Second World War, eight people hid here for more than two years. Not underground. Not in a bunker. Just… behind a wall.\n\nIn a house designed for trade. These buildings were built to store goods. Multiple floors, back rooms, attics, hidden corners. Efficient use of space. Perfect for spices. Also… surprisingly effective for people who don't want to be found.\n\nThink about that for a second.\n\nA city built to move everything quickly and visibly… also became very good at hiding things in plain sight.\n\nHistory often teaches us to look for evil in grand symbols and dramatic places. But persecution can happen quietly in familiar streets behind everyday façades, while normal life continues outside.\n\nAnne Frank's diary remains powerful because it reminds us that the people inside were not symbols. They were people with fears, arguments, hopes, humor, and plans.\n\nThis house asks a serious question: When injustice becomes normal, who notices — and who acts?`,
      },
      {
        key: 'historical',
        title: 'Historical context',
        text: `The Anne Frank House stands on the Prinsengracht, in a canal house built during Amsterdam's commercial expansion.\n\nLike many buildings here, it originally combined business and storage space with rooms above and behind. In the 1940s, Otto Frank's company operated from the front part of the premises.\n\nAfter the German occupation of the Netherlands in 1940, anti-Jewish measures intensified step by step: exclusion from public life, confiscation of rights, forced registration, deportations.\n\nIn July 1942, Anne Frank and others went into hiding in the concealed rear section of this building, later known as the Secret Annex.\n\nThey remained hidden for more than two years until betrayal led to their arrest in 1944.\n\nOnly Otto Frank survived the camps.\n\nThe building survives today not as architecture, but as evidence: how quickly normal life can collapse when discrimination becomes policy.`,
      },
      {
        key: 'anecdotes',
        title: 'Local anecdotes',
        text: `Anne Frank's diary is often remembered because she was young.\n\nThat matters. But it is not the whole reason. It endures because the writing remains humane, intelligent, observant, and painfully ordinary.\n\nShe writes about fear, family tension, hope, boredom, dreams, annoyance, identity. Not abstract history. Daily life under impossible pressure. That is what makes it powerful.\n\nEvil often enters history as ideology and slogans. Victims remain human through detail. A teenager arguing with adults. Wanting privacy. Imagining the future.\n\nDutch tolerance is often celebrated today, and sometimes rightly so. This house is also a reminder of the opposite: tolerance is not permanent.\n\nIt must be defended repeatedly, especially when fear becomes fashionable.`,
      },
      {
        key: 'highlights',
        title: 'Neighborhood highlights',
        text: `The canal outside is the Prinsengracht, one of the major waterways of the canal belt.\n\nNearby stands the Westerkerk, whose tower Anne Frank could see and whose bells she mentioned in her diary. That tower is one of the most recognizable landmarks in Amsterdam.\n\nThe surrounding Jordaan district was historically a working-class neighborhood and is now one of the city's most desirable residential areas.\n\nClose by you'll also find the Homomonument, dedicated to LGBTQ+ people persecuted for who they were — another reminder that exclusion takes many forms.\n\nThis area is beautiful. That contrast matters too. History does not always happen in dark places. Sometimes it happens on lovely streets in ordinary cities.`,
      },
      {
        key: 'food',
        title: 'Food and Drinks',
        text: `This is a place where many visitors prefer a quieter pause.\n\nNearby, Café Winkel 43 (Noordermarkt 43) is a reliable option for coffee or apple pie.\n\nFor a calmer canal-side setting, cafés around the Noordermarkt and western Jordaan often feel less hectic than the immediate museum queue area.\n\nIf you want a moment of reflection, simply walking a few minutes along the Prinsengracht can be better than any café.\n\nNot every stop needs consumption. Sometimes a slower pace is enough.`,
      },
      {
        key: 'next',
        title: "What's next",
        text: `From here, continue toward De 9 Straatjes.\n\nYou are leaving a place of memory and warning, and returning to streets shaped by trade, daily life, and reinvention.\n\nThat contrast is part of Amsterdam too:\n\nJoy beside grief. Beauty beside history. Normal life continuing beside remembrance.`,
      },
    ],
    routeImage: "https://app.billsbiketour.com/wp-content/uploads/2025/11/Screenshot-2025-11-02-at-9.09.52-PM.png",
    routeMapsUrl: "https://www.google.com/maps/d/viewer?mid=14i4Mzq16luD59nTQbvSk__k7P-MAFSk",
    get narrative() { return this.sections[0].text; },
  },
  {
    id: 5,
    name: "De 9 Straatjes",
    lat: 52.3695,
    lng: 4.8840,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Brug_24_in_de_Hartenstraat_over_de_Herengracht_foto_2.jpg/960px-Brug_24_in_de_Hartenstraat_over_de_Herengracht_foto_2.jpg",
    sections: [
      {
        key: 'introduction',
        title: 'Introduction',
        text: `Welcome to De 9 Straatjes. Nine Streets. That's the name.\n\nNot "The Charming Boutique Quarter." Not "Historic Lifestyle District." Just… Nine Streets.\n\nWe like clarity. Because a few hundred years ago, vague directions could get you killed. "Let's meet somewhere over there." Yeah great — enjoy drowning, genius.\n\nSo we kept it simple. Now, look around you. Cute shops. Coffee places. Vintage clothes. Handmade candles that smell like "Nordic forest after emotional growth." Adorable.\n\nBut this used to be serious business. Goods came in through the canals, got stored, moved, sold, shipped out. Fast. Efficient. No nonsense.\n\nAnd the funny part? Nothing changed. Same buildings. Same layout. Same system. Only the product is different.\n\nWe used to move spices through here… now we move people who say "I wasn't going to buy anything" and leave €120 poorer.`,
      },
      {
        key: 'historical',
        title: 'Historical context',
        text: `De 9 Straatjes, or The Nine Streets, sit within the canal belt and were laid out during the 17th-century expansion of Amsterdam.\n\nThese small cross-streets linked the major canals and made movement between them faster and more practical. That may sound modest, but modest infrastructure often creates major value.\n\nGoods arrived by boat, were stored in canal houses, sold nearby, processed, traded again, and moved onward. Efficiency loves short distances.\n\nThis district became a fine-grained network inside a larger commercial machine.\n\nAnd that reflects a Dutch habit: we do not only think big. We also obsess over tiny improvements that make the whole system better.\n\nA smarter route. A shorter walk. One extra bridge. Nine useful streets.`,
      },
      {
        key: 'anecdotes',
        title: 'Local anecdotes',
        text: `Visitors often think this area became charming by accident.\n\nAbsolutely not. Here, charm is usually what happens after industry gets expensive. These narrow streets once supported storage, labor, deliveries, and trade. Today they sell atmosphere, design, identity, and things you did not know you needed five minutes ago.\n\nThat shift says a lot about Amsterdam. When one economy fades, we rarely mourn for long. We repurpose.\n\nWarehouse becomes loft. Workshop becomes espresso bar. Utility space becomes concept store.\n\nSometimes people call that gentrification. Sometimes they call it brunch. Both can be true.\n\nThe deeper instinct is adaptation. If the world changes, we change the product and keep the building.\n\nVery Dutch.`,
      },
      {
        key: 'highlights',
        title: 'Neighborhood highlights',
        text: `This area lies between the canals of Prinsengracht, Keizersgracht, and Herengracht, giving it one of the most walkable layouts in the city.\n\nYou are close to the Houseboat Museum, hidden courtyards, independent boutiques, and many small cafés.\n\nThe bridges here offer classic canal views in almost every direction, which explains why phones mysteriously appear in everyone's hands. Nearby Westerkerk remains an easy landmark for orientation.\n\nThis district feels intimate because the streets are narrower and busier with storefront life than the grand canal avenues beside them.\n\nBig-city success. Small-street packaging.`,
      },
      {
        key: 'food',
        title: 'Food and Drinks',
        text: `You are spoiled for choice here, which is both blessing and trap.\n\nFor cookies, Van Stapele Koekmakerij (Heisteeg 4) is nearby and deservedly popular.\n\nFor brunch or coffee, the side streets around the district have many solid options; choose places with locals, not only phones pointed at pancakes.\n\nFor a brown café atmosphere, spots toward the Jordaan edge usually feel more authentic and less performative.\n\nPractical rule: If the menu uses the word artisan seven times, keep walking.`,
      },
      {
        key: 'next',
        title: "What's next",
        text: `From De 9 Straatjes, continue south toward Vondelpark.\n\nYou are leaving a district that perfectly summarizes Amsterdam: old streets, new products, historic buildings, modern spending habits.\n\nSame system. Updated invoice.\n\nNext stop: Amsterdam's park — the place the city built when it decided efficiency alone wasn't enough.`,
      },
    ],
    routeImage: "https://app.billsbiketour.com/wp-content/uploads/2025/11/Screenshot-2025-11-02-at-9.14.03-PM.png",
    routeMapsUrl: "https://www.google.com/maps/d/viewer?mid=1cKEZmsm_Y-rPL5BzbbLagu_4-yFVpfE",
    get narrative() { return this.sections[0].text; },
  },
  {
    id: 6,
    name: "Vondelpark",
    lat: 52.3580,
    lng: 4.8686,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Amsterdam%2C_Vondelpark%2C_at_the_pond-2.jpg/960px-Amsterdam%2C_Vondelpark%2C_at_the_pond-2.jpg",
    sections: [
      {
        key: 'introduction',
        title: 'Introduction',
        text: `Welcome to Vondelpark.\n\nNow let me be direct with you: this park exists because we became too efficient.\n\nFor centuries, we were busy doing sensible things. Building dykes. Digging canals. Trading spices. Draining swamps. Inventing capitalism. Arguing about taxes. Staying dry.\n\nVery productive. Also exhausting. So eventually someone had the courage to say: "What if we sit down for a bit?"\n\nRadical idea.\n\nBecause look around you now. People lying in the grass doing absolutely nothing. Couples walking nowhere in particular. Friends drinking coffee they could have made at home for one tenth of the price. And nobody is being judged. That is progress.\n\nYou have to understand: in most of Amsterdam, every square meter used to need a job. Store goods. Move goods. House people. Make money. Then one day we looked at a valuable piece of land and decided: let's use it for birds, trees, naps, and questionable picnic conversations.\n\nFinancially irresponsible. Emotionally excellent. That's Dutch pragmatism in a different form.\n\nPeople don't run on efficiency forever. So we fixed that too. After we finished optimizing everything… we decided to optimize nothing as well.`,
      },
      {
        key: 'historical',
        title: 'Historical context',
        text: `Vondelpark opened in 1865, during a period when Amsterdam was expanding beyond its old canal core.\n\nUntil then, land inside and around the city had usually been judged by practical value: trade, housing, industry, transport, water management. Then a different idea gained support: maybe a city should also be good for the people living in it.\n\nThe park began as a private initiative by citizens who wanted green space for walking and recreation. It later expanded and became public. Even that is a very Dutch pattern.\n\nWe often wait until something becomes clearly necessary… then solve it efficiently. Once industrial cities became crowded, noisy, and unhealthy, parks stopped being luxury items. They became infrastructure.\n\nVondelpark is not an accident of beauty. It is a practical response to urban stress.`,
      },
      {
        key: 'anecdotes',
        title: 'Local anecdotes',
        text: `Foreign visitors sometimes think Dutch people are naturally relaxed.\n\nThat is adorable. The truth is, we are so organized we even schedule relaxation. You can see it here. People jogging with watches. Picnic blankets arranged with suspicious symmetry. Parents managing children with military-level logistics. Even leisure can become a system. And yet, there is something healthy in that.\n\nDutch culture can be direct, efficient, and relentlessly practical. Useful traits when fighting water, building cities, or arguing in meetings.\n\nLess useful when your brain needs a day off. So we created places like this. Not to escape who we are. To make who we are sustainable. Pragmatism again.\n\nIf stress becomes the problem, relaxation becomes the solution.`,
      },
      {
        key: 'highlights',
        title: 'Neighborhood highlights',
        text: `Vondelpark stretches through Amsterdam South and contains more than open lawns.\n\nNear the center stands the open-air theatre, which hosts performances in summer.\n\nYou'll also find ponds, winding paths, playgrounds, rose gardens, and plenty of benches that people defend with quiet determination on sunny days.\n\nAt the eastern side of the park, you are close to Leidseplein, one of the city's nightlife areas.\n\nAt the northern edge lies Museumplein, home to several major museums.\n\nLook for the statue of Joost van den Vondel, the writer after whom the park is named. Once the statue arrived, the park's popular nickname became official.\n\nEfficient naming. Naturally.`,
      },
      {
        key: 'food',
        title: 'Food and Drinks',
        text: `For a relaxed stop inside the park, Groot Melkhuis (Vondelpark 2) is a dependable classic with terrace seating.\n\nFor coffee nearby, Coffee District (Willemsparkweg area) is a strong option just outside the park.\n\nIf you want something more substantial after cycling, the streets around the north-east corner of the park have many cafés and lunch spots.\n\nDutch sunny-day wisdom: If one terrace has no free seats, the next one probably has better service anyway.`,
      },
      {
        key: 'next',
        title: "What's next",
        text: `From Vondelpark, continue toward Museumplein.\n\nYou are moving from Amsterdam's place to unwind… to its place to impress.\n\nGrass gives way to grand buildings, open lawns to grand statements.\n\nSame city. Different kind of performance.`,
      },
    ],
    routeImage: "https://i.postimg.cc/NftHs28X/Screenshot-2026-04-23-at-6-59-46-PM.png",
    routeMapsUrl: "https://www.google.com/maps/d/u/2/edit?mid=1cDTh2I_Lesp7dDPKWcd4_DbEHM0fkEw&usp=sharing",
    get narrative() { return this.sections[0].text; },
  },
  {
    id: 7,
    name: "Museumplein",
    lat: 52.3590,
    lng: 4.8832,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Amsterdam%2C_Holland_%28Ank_kumar_%29_12.jpg/960px-Amsterdam%2C_Holland_%28Ank_kumar_%29_12.jpg",
    sections: [
      {
        key: 'introduction',
        title: 'Introduction',
        text: `Welcome to Museumplein.\n\nNow look around you. Big open space. Expensive buildings. Clean lines. Lots of room to breathe. Feels important, doesn't it?\n\nThat's because this is where we prove we're not just traders. After a few centuries of making money, we ran into a slightly awkward situation: "We're rich… but it looks like we only care about money."\n\nNot ideal. So we fixed it. We built this. Art. Culture. Wide spaces. Carefully designed surroundings. Very calm. Very controlled. Very… sophisticated.\n\nBut don't be fooled. None of this starts here. It starts with trade. No ships, no money. No money, no art. No art… no reason for you to be standing here pretending you understand it.\n\nSo what you're looking at is not the opposite of business. It's the result of it. This is what happens when profit… decides it needs better branding.`,
      },
      {
        key: 'historical',
        title: 'Historical context',
        text: `Museumplein took shape in the late 19th century, when Amsterdam expanded beyond the old canal belt and wanted to present itself as a modern European capital.\n\nBy then, the city had centuries of commercial success behind it. Trade had funded institutions, infrastructure, and a growing middle class. Wealth was no longer only stored in warehouses or canal houses. It could now be displayed in public life.\n\nThe Rijksmuseum opened in 1885 as a national museum celebrating Dutch history and art. Later came the Concertgebouw and other cultural institutions nearby.\n\nThis area was deliberately planned as spacious and monumental — the opposite of the tight medieval center.\n\nThat contrast matters. The old city says: work hard, use every meter. Museumplein says: we can afford some breathing room now.`,
      },
      {
        key: 'anecdotes',
        title: 'Local anecdotes',
        text: `Dutch people often seem modest.\n\nUntil we become proud of being modest. Then it gets quite competitive. Museumplein captures that contradiction beautifully.\n\nWe don't usually boast with fountains, giant staircases, or marble emperors on horses. That feels excessive. Instead, we say: "No no, nothing flashy."\n\nAnd then quietly build world-class museums, one of Europe's best concert halls, and fill them with masterpieces. Subtle bragging. Very advanced technique.\n\nIt also reflects something deeper. Dutch culture often distrusts loud status signals. Showing off too directly can make people suspicious. But excellence? That we respect. So if you want admiration here, don't shout.\n\nBuild something undeniable.`,
      },
      {
        key: 'highlights',
        title: 'Neighborhood highlights',
        text: `The most dominant building here is the Rijksmuseum, home to works by Rembrandt, Vermeer, and many others.\n\nTo one side stands the Concertgebouw, internationally known for acoustics and classical performances.\n\nNearby is the Van Gogh Museum, one of the city's most visited museums.\n\nThe open lawn of Museumplein is used year-round: picnics in summer, events and gatherings throughout the year, and an ice rink in winter seasons when installed.\n\nYou are also close to the elegant streets of Amsterdam South, where the city becomes wider, calmer, and noticeably wealthier.\n\nThis whole area was designed to feel spacious. After the canal center, it almost feels suspiciously generous.`,
      },
      {
        key: 'food',
        title: 'Food and Drinks',
        text: `For a classic local stop nearby, Café Loetje (Johannes Vermeerstraat 52) is well known for steak and a long-standing Amsterdam reputation.\n\nFor coffee and something lighter, Blushing Amsterdam (Cornelis Schuytstraat area) is a polished nearby option.\n\nInside the Rijksmuseum gardens area, Rijks Café can be practical if you're already visiting.\n\nIf prices here feel higher than elsewhere: correct observation. You are standing in one of the city's more elegant neighborhoods.`,
      },
      {
        key: 'next',
        title: "What's next",
        text: `From Museumplein, continue toward the canals again.\n\nYou're leaving the polished face of prosperity and heading back into older streets where wealth was first earned, traded, taxed, and argued over.\n\nNext stop: a reminder that even in a city of logic… some things survive simply because people love them.`,
      },
    ],
    routeImage: "https://app.billsbiketour.com/wp-content/uploads/2025/11/Screenshot-2025-11-02-at-9.28.03-PM.png",
    routeMapsUrl: "https://www.google.com/maps/d/viewer?mid=1S1cZcTQ8xWwRKKImg9Dkw7hhs6ziA48",
    get narrative() { return this.sections[0].text; },
  },
  {
    id: 8,
    name: "Skinny Bridge",
    lat: 52.3637,
    lng: 4.9024,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Amsterdam_Magere_Brug_3.jpg/960px-Amsterdam_Magere_Brug_3.jpg",
    sections: [
      {
        key: 'introduction',
        title: 'Introduction',
        text: `Welcome to the Skinny Bridge.\n\nNow this one is interesting. Because in a country where we optimize absolutely everything… this slipped through.\n\nLook at it. Narrow. Opens constantly. Slows people down. From a Dutch perspective, that's three problems in one structure.\n\nIf this were a house, we'd redesign it. If it were a system, we'd optimize it. If it were a business, we'd shut it down.\n\nBut this? We kept it. And somehow… it became famous. Which is confusing. Because usually, if something doesn't work well, we fix it until it does. But every now and then, something survives not because it's efficient… but because people like it. And for us, that's already a bit uncomfortable.\n\nIn a city built on logic… this is what happens when we allow one irrational decision to survive.`,
      },
      {
        key: 'historical',
        title: 'Historical context',
        text: `The Skinny Bridge, or Magere Brug, crosses the Amstel River and links two old parts of the city.\n\nBridges here were never optional. In a city cut by water, crossings meant movement, trade, access, and daily life. If people cannot cross efficiently, the whole system slows down.\n\nSo naturally, most bridges were practical machines. Which makes this one unusual. The current bridge dates from the 20th century, replacing older versions that stood here before. It was deliberately rebuilt in a traditional wooden drawbridge style, even when more modern options existed.\n\nThat tells you something useful about Dutch pragmatism: we are practical… but not stupidly practical. If beauty adds value, memory adds value, or people love something enough, we keep it.\n\nEfficiency matters. But so does quality of life. That balance is harder than it looks.`,
      },
      {
        key: 'anecdotes',
        title: 'Local anecdotes',
        text: `There is a local story that two wealthy sisters once lived on opposite sides of the river and wanted a bridge between their houses. Whether true or not, it's a much nicer story than "municipal infrastructure upgrade."\n\nAnother tradition says that if you kiss under the Skinny Bridge, your love will last forever. Very convenient claim. No refunds. No scientific review. Strong tourism potential. That romantic reputation is one reason many wedding boats pass under here.\n\nNow notice something important. Even our love stories need infrastructure. A kiss requires timing, route planning, and a licensed captain.\n\nThat may be the most Dutch sentence of the day.\n\nRomance, yes. But organized.`,
      },
      {
        key: 'highlights',
        title: 'Neighborhood highlights',
        text: `Just beside the bridge you can observe the Amstel River locks and water-control structures that help regulate levels and movement through the city. Water here is not decorative. It is managed constantly.\n\nNearby stands the Stopera, home to Amsterdam's city hall and opera house. The name combines stadhuis (city hall) and opera. Many locals disliked the project when built: too expensive, too modern, too everything.\n\nA classic Amsterdam tradition: first protest loudly. Later use it normally.\n\nAlso close by is the Blauwbrug (Blue Bridge), a grander stone bridge often compared to Parisian styles. One city, three bridges nearby.\n\nPractical, elegant, argumentative. Very Amsterdam.`,
      },
      {
        key: 'food',
        title: 'Food and Drinks',
        text: `This area gives you good options without the chaos of the center.\n\nFor a classic brown café, Café de Sluyswacht (Jodenbreestraat 1) is nearby and wonderfully crooked.\n\nFor something more refined, the Utrechtsestraat area has strong cafés, bakeries, and restaurants a short ride away.\n\nIf the weather is kind, terraces along the Amstel can be an excellent pause point.\n\nDutch rule of thumb: If there is sun, we sit outside within three minutes.`,
      },
      {
        key: 'next',
        title: "What's next",
        text: `From the Skinny Bridge, continue toward the Flower Market.\n\nYou're leaving one of Amsterdam's most romantic spots and heading toward one of its most efficient illusions: nature… packaged for sale.`,
      },
    ],
    routeImage: "https://app.billsbiketour.com/wp-content/uploads/2025/11/Screenshot-2025-11-02-at-9.30.02-PM.png",
    routeMapsUrl: "https://www.google.com/maps/d/viewer?mid=1xn8VLEL2l_WmDqk8LrFw1vwb1VpQ13Y",
    get narrative() { return this.sections[0].text; },
  },
  {
    id: 9,
    name: "Flower Market",
    lat: 52.3668,
    lng: 4.8929,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/SingelBloemenmarkt.jpg/960px-SingelBloemenmarkt.jpg",
    sections: [
      {
        key: 'introduction',
        title: 'Introduction',
        text: `Welcome to the Flower Market.\n\nNow this is where things get… slightly ridiculous. Because we went from: "Let's build a country so we don't drown…" to: "Let's sell flowers."\n\nAnd not just grow them. No — we built an entire global industry around something that dies in a week. That's the product. You buy it. It looks great. A few days later… it's gone.\n\nSo naturally, you buy more. Which, if you think about it, is a perfect business model.\n\nNow here's the clever part. We didn't just grow flowers. We applied the exact same system we used for trade. Mass production. Global logistics. Auctions. Export.\n\nOnly difference? Instead of spices or coffee… we're shipping something that comes with an expiration date. And somehow… that made it even better. Because if it doesn't last… people have to come back.\n\nWe didn't just master trade… we figured out how to make temporary things permanently profitable.`,
      },
      {
        key: 'historical',
        title: 'Historical context',
        text: `The Flower Market, or Bloemenmarkt, dates from the 19th century and was originally a market of floating barges on the Singel canal.\n\nGrowers brought flowers into the city by boat and sold them directly from the water. In Amsterdam, if something can be turned into trade using canals, it usually will be.\n\nToday the stalls stand on fixed platforms, but the floating-market origin remains part of its identity.\n\nThe bigger story, however, is national. Dutch flower success did not come from randomly liking tulips. It came from systems. Specialized growers, controlled greenhouses, auction networks, refrigeration, transport links, and international distribution.\n\nBeauty alone rarely wins. Beauty with logistics is unstoppable. That combination made the Netherlands one of the world's leading flower exporters.\n\nPretty petals. Serious infrastructure.`,
      },
      {
        key: 'anecdotes',
        title: 'Local anecdotes',
        text: `Many visitors think tulips are a deeply ancient Dutch tradition.\n\nSlight complication: tulips originally came from Central Asia and became famous in Europe via the Ottoman world.\n\nSo naturally, we imported them… then scaled the business until people assumed we invented them. Also very Dutch.\n\nThen came Tulip Mania in the 1630s, when certain bulbs sold for absurd prices. People hear that story and think: "How foolish."\n\nPlease. Humans still do this constantly. Only now the useless objects are digital. Or they come in the form of a duct tape banana.\n\nThe deeper lesson is not greed. It is that Dutch culture has long been comfortable trading things whose value depends entirely on what other people believe.\n\nFlowers. Futures. Stocks. Startups. Same psychology. Different packaging.`,
      },
      {
        key: 'highlights',
        title: 'Neighborhood highlights',
        text: `The market sits along the Singel, one of Amsterdam's oldest canals and once the outer edge of the medieval city.\n\nNearby stands the Munttoren (Mint Tower), a reminder that trade and money were never far apart here.\n\nA short walk away is the Begijnhof, one of the city's quiet hidden courtyards and oldest residential enclaves.\n\nYou are also close to Koningsplein and the shopping streets that connect center and canal belt.\n\nThis stop is useful because it reveals something essential: flowers in front. Finance, history, and real estate all around them.\n\nClassic Amsterdam priorities.`,
      },
      {
        key: 'food',
        title: 'Food and Drinks',
        text: `This area has plenty of practical stops.\n\nFor coffee and people-watching, the cafés around Koningsplein and Spui are nearby and plentiful.\n\nFor a classic brown café with history, Café Hoppe (Spui 18-20) remains a strong choice.\n\nFor something sweet, Van Stapele Koekmakerij (Heisteeg 4) is not far and widely loved for cookies.\n\nPragmatic tip: If a place displays twenty plastic tulips and three microwaves, maybe keep cycling.`,
      },
      {
        key: 'next',
        title: "What's next",
        text: `From the Flower Market, continue toward the Red Light District.\n\nYou're leaving a place where temporary beauty is sold politely… and heading toward a place where Amsterdam applies the same old principle: if something exists anyway, manage it openly.\n\nThe route takes you right through the Red Light District. You may need to walk some parts when it's crowded.`,
      },
    ],
    routeImage: "https://app.billsbiketour.com/wp-content/uploads/2025/11/Screenshot-2025-11-02-at-9.33.24-PM.png",
    routeMapsUrl: "https://www.google.com/maps/d/viewer?mid=1aJwhXsFpiJjDIIwnTuePN_pRgQVSakw",
    get narrative() { return this.sections[0].text; },
  },
  {
    id: 10,
    name: "Red Light District",
    lat: 52.3741,
    lng: 4.8990,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Oudezijds_Achterburgwal.jpg/960px-Oudezijds_Achterburgwal.jpg",
    sections: [
      {
        key: 'introduction',
        title: 'Introduction',
        text: `Welcome to the Red Light District.\n\nAnd yes — it's called the Red Light District because… well, just look around you. Red lights. We like to keep things simple.\n\nNow, let's not pretend this is some perfect system. There's exploitation. There's crime. There are real problems here. We know that.\n\nBut here's where things get interesting. Most cities see that and think: "Shut it down. Get rid of it. Push it out." Sounds good. But it doesn't work.\n\nBecause these ladies wouldn't magically stop working. They just move. Out of sight. Out of control. Parking lots. Highway exits. Places where nobody's watching. No information centers. No free condoms. No health checks. No panic buttons.\n\nSo we made a different choice. We keep it here. Right in the center. Visible. Regulated. Not perfect… but controlled. Because if something exists anyway… you might as well make it safer.\n\nThat's the Dutch way. Not moral perfection… just a very practical solution to an uncomfortable problem.`,
      },
      {
        key: 'historical',
        title: 'Historical context',
        text: `This area is one of the oldest parts of Amsterdam and grew beside the medieval harbor.\n\nFor centuries, ships arrived nearby carrying sailors, merchants, laborers, and travelers. Where ports grow busy, demand follows close behind. Taverns, lodging houses, gambling, drinking, and sex work often cluster in the same districts.\n\nAmsterdam was no exception. What became different was the long-term response. Rather than pretending prostitution could be eliminated entirely, Dutch policy gradually shifted toward regulation, taxation, health oversight, and public order.\n\nThat approach changed many times and has never been free of controversy. But it reflects a recurring Dutch instinct: if a perfect solution does not exist, reduce the damage.\n\nNot glamorous. Yet often very effective.`,
      },
      {
        key: 'anecdotes',
        title: 'Local anecdotes',
        text: `Visitors sometimes confuse tolerance with approval.\n\nImportant difference. Tolerance here usually means: "We may not love it, but banning it creates worse problems."\n\nThat distinction explains a lot about Dutch culture. Coffee shops. Soft drugs. Sex work. Cycling through places that probably say no cycling.\n\nThe question is often not: "Is this morally pure?" The question is: "What happens if we force it underground?"\n\nThat mindset can feel strange to outsiders who prefer cleaner rules. But rules are easy. Reality is difficult. So Dutch liberalism often looks less romantic than people expect.\n\nLess "freedom for all."\n\nMore: "Let's keep the mess manageable."`,
      },
      {
        key: 'highlights',
        title: 'Neighborhood highlights',
        text: `Right in the heart of the district stands the Oude Kerk — the Old Church — Amsterdam's oldest building.\n\nYes, a medieval church surrounded by red-lit windows.\n\nIf you want one image explaining Dutch contradictions, start there.\n\nNearby you may find the bronze breast sculptures set into the pavement, a playful public artwork people often accidentally step on while pretending not to look down.\n\nClose by is Our Lord in the Attic, a hidden 17th-century church built inside canal houses when open Catholic worship was restricted. Again, very Dutch: official rule above. Practical workaround below.\n\nYou may also notice the statue of Majoor Bosshardt, known for Salvation Army outreach and compassion in this neighborhood. She was, for many, the moral heart of a complicated street.\n\nMoral judgment has many voices here. So does tolerance.`,
      },
      {
        key: 'food',
        title: 'Food and Drinks',
        text: `This area is busy, loud, and full of tourist traps. Choose carefully.\n\nFor history and atmosphere, Café 't Aepjen (Zeedijk 1) is one of the oldest bars in the city.\n\nFor classic late-night Dutch snacking, FEBO on Nieuwendijk is not far if hunger beats dignity.\n\nFor better food, move one or two streets toward Nieuwmarkt or Zeedijk, where options improve quickly.\n\nPractical wisdom: The louder the menu photos, the lower the expectations.`,
      },
      {
        key: 'next',
        title: "What's next",
        text: `From here, continue toward Central Station.\n\nYou're heading back to the place where trade, transport, and constant movement shaped the city from the beginning.\n\nFitting, really. Because this district also exists for the same old Amsterdam reason: where people gather… systems appear.`,
      },
    ],
    routeImage: "https://app.billsbiketour.com/wp-content/uploads/2025/11/Screenshot-2025-11-02-at-10.19.05-PM.png",
    routeMapsUrl: "https://www.google.com/maps/d/viewer?mid=1SCe_a_zkuzsxgntAcc0SYY-lDcU7fHQ",
    get narrative() { return this.sections[0].text; },
  },
];

export const FAQ = [
  { q: "How do I start the tour?", a: ["Log in using your email address.", "Open your booked tour.", "Choose the entire route or go step-by-step.", "Follow the route and start exploring."], note: "You can log in anytime within 48 hours after your first login." },
  { q: "Do I need to download an app?", a: "No. The tour runs directly in your browser. No app download is required." },
  { q: "How much mobile data does the tour use?", a: "The tour uses minimal mobile data. Audio streams efficiently and maps are available offline once loaded. Most users consume only a small amount of data. Amsterdam also has many public Wi-Fi hotspots." },
  { q: "What if the page doesn't load?", a: ["Refresh the page", "Or log out and log back in"], note: "This resolves almost all issues." },
  { q: "What if the audio doesn't play?", a: ["Check your volume", "Turn off silent mode", "Try another browser", "Refresh the page"] },
  { q: "Can I pause and continue later?", a: "Yes. You can stop and resume anytime within your access period." },
  { q: "What if my phone battery dies?", a: "You can log back in later from any device." },
  { q: "Is this a live tour?", a: "No. This is a self-guided digital experience. There is no live guide." },
  { q: "Is a bike included?", a: "No. Bike rental is separate." },
  { q: "Can I get a refund if I couldn't access the tour?", a: "Please send a screenshot of the error to info@toursandtravels.amsterdam. We will respond within 48 hours." },
  { q: "Is this safe?", a: "Routes avoid the busiest streets where possible. Always keep your eyes on the road and follow local traffic rules." },
  { q: "What if I get lost?", a: "The route map is always visible and you can restart any section anytime." },
  { q: "Is support available?", a: "We provide limited automated support through our chatbot. Support is not live." },
];

export const HERO_COLORS = [
  "linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d)",
  "linear-gradient(135deg, #2c3e50, #4ca1af)",
  "linear-gradient(135deg, #614385, #516395)",
  "linear-gradient(135deg, #4a6741, #8fbc8f)",
  "linear-gradient(135deg, #c85a6e, #e8a0b0)",
  "linear-gradient(135deg, #2e7d32, #81c784)",
  "linear-gradient(135deg, #283593, #5c6bc0)",
  "linear-gradient(135deg, #4e342e, #8d6e63)",
  "linear-gradient(135deg, #d4456a, #f48fb1)",
  "linear-gradient(135deg, #b71c1c, #ef5350)",
];

export const HERO_EMOJI = ["🚉", "👑", "🏘️", "🕯️", "🛍️", "🌳", "🏛️", "🌉", "🌷", "🔴"];
