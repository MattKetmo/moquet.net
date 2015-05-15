---
title: Realtime geolocation tracking with Firebase
layout: post
---

I went recently to Google Paris offices to attend an [Angular meetup](http://www.meetup.com/AngularJS-Paris/events/221083701/)
sponsorised by [Firebase](https://www.firebase.com/).
Although I've already heard about Firebase in the past (mainly when they got [acquired by Google](https://www.firebase.com/blog/2014-10-21-firebase-joins-google.html))
I've never tried it myself to see what it is capable of.
Here is a quick experiment I did to play with it.

<p class="banner-container">
  <img
    class="Image center responsize isRounded"
    src="/uploads/blog/2015-04-16-realtime-geolocation-tracking-firebase/locatme-banner.png"
    alt="Locat.me banner"/>
</p>

## Firebase

Firebase is a **Database as a Service** which lets you **store and synchronize** data in (near) real-time.

As it focuses mostly on frontend and mobile apps you will find an **SDK** for Android, iOS and JavaScript.
But it also exposes a **REST API** so you can do basic CRUD operations from your backend.

The SDK allows you to establish a connection to their backend and receive notifications as soon as
data is updated. By "real-time" they ensure you to receive those events in less than 200ms.
They use [WebSockets](https://developer.mozilla.org/fr/docs/WebSockets) if available or fallback
to long polling if not.

They also propose other features like [offline capabilities](https://www.firebase.com/docs/web/guide/offline-capabilities.html)
(similar to what PouchDB offers) and delegated Authentication (via Google/Twitter/Facebook connect).
I won't go much into details but invite you to [read the docs](https://www.firebase.com/docs/)
or signup to try the [quick tutorial](https://www.firebase.com/how-it-works.html) for more details.

## Introducing Locat.me

By using such technology you can develop an Uber-like application very easily, they said.
I was eager to test it.
Their admin dashboard is quite intuitive and the API is so simple that you can do powerful
thing quickly.

My proof of concept is very basic but it may be useful in some situations.

It's an app you can use to **easily locate your friends** when you have an appointment
but you don't have an accurate meeting point.
You know they are close but you have difficulties in explaining where you are exactly
(it could be a parallel street or just somewhere else in the park).

How the app works is very simple:

- **go to** [locat.me](http://locat.me/) with a browser and **accept** to share your current position
  (it uses the HTML5 [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation))
- **copy** the URL (a unique id has been generated in the hash) and **send** it to your friend
  (eg. use the "Share" option from your browser to send an SMS)

And that's it!

Now each time someone will go on that URL a new (anonymous) marker will be added
and the map will be refreshed without you do anything.
Blue point is your position while orange ones are others.

<p>
  <a href="/uploads/blog/2015-04-16-realtime-geolocation-tracking-firebase/locatme-screenshot.png">
    <img
      class="Image center responsize"
      src="/uploads/blog/2015-04-16-realtime-geolocation-tracking-firebase/locatme-screenshot.png"
      alt="Locat.me Screenshot"
      width="300px" />
  </a>
</p>

You can also use a custom identifier to share. Useful for named events
(for instance [locat.me/#my_meetup](http://locat.me/#my_meetup) or even [locat.me/#MattKetmo](http://locat.me/#MattKetmo))

<div class="note warning">
  <p>
    Note that since I'm using the free hacker plan of Firebase the maximum of
    connected users simultaneously is limited to 50.
  </p>
</div>

<div class="note info">
  <p>
    About the domain name, this is a gift from Gandi which offered some free domains for their 15th birthday.
    As I won a <code>.me</code> I decided to use it for that occasion (unfortunatly every cool and short domain names
    were already taken so I needed to sacrifice the final "e" letter).
  </p>
</div>


## Just code it

Now that I explained the main idea it's time to play with it.
The code is really trivial.
I think it took me less than an hour while watching a stupid movie on TV to get something working.

To display the map and the markers I used [Mapbox](https://www.mapbox.com/).
First time I played with it too.
But my usage is very simple. This is what I just need to know:

```js
// Load the map canvas in the #map block
var map = L.mapbox.map('map', 'examples.map-i86nkdio')

map.on('ready', function() {

  // Add a new marker on the map
  var marker = L.marker([latitude, longitude]).addTo(map)

  // Update the marker position
  marker.setLatLng([latitude, longitude])

})
```

Second thing I need to handle is the URL hash (ie. the map identifier).
Here I just generate a new one unless it already exists.

```js
// Read the current hash
var mapId = location.hash.replace(/^#/, '');

// If not set generate a new one
if (!mapId) {
  mapId = (Math.random() + 1).toString(36).substring(2, 12);
  location.hash = mapId;
}
```

This hash will help me to group markers together.
I will use Firebase to read and write the geolocations under the `/maps/{mapId}` endpoint.

<p>
  <a href="/uploads/blog/2015-04-16-realtime-geolocation-tracking-firebase/screenshot-firebase-admin.png">
    <img
      class="Image center responsize"
      src="/uploads/blog/2015-04-16-realtime-geolocation-tracking-firebase/screenshot-firebase-admin.png"
      alt="Firebase admin screenshot"
      style="max-height:550px" />
  </a>
</p>

As you can see on this admin panel screenshot every marker is stored under the path
`/maps/{mapId}/{markerId}`. It has a `coord` attribute with a latitude and a longitude
as well as a timestamp to know its last update date.

I've also set the security rules to avoid people fetching every map ids.
You can only read and write on path `/maps/{mapId}` but not directly on `/maps`.

```json
{
  "rules": {
    "maps": {
      "$map": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

The marker identifiers are unique per browser.
I used a simple UUID generator function and save it in current [LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage).
It allows user to refresh the page without creating another marker on the map.

```js
// Get current UUID
var myUuid = localStorage.getItem('myUuid');

// Create a new one for newcomers
if (!myUuid) {
  myUuid = guid();
  localStorage.setItem('myUuid', myUuid);
}
```

Now the main action is to get user's current location and store it on Firebase.
I'm using the HTML5 Geolocation API which provide a [watch function](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/Using_geolocation#Watching_the_current_position)
to be notified of his positions.

```js
// Access to Firebase instance of current map
var markersRef = new Firebase('https://locatme.firebaseio.com/maps/' + mapId);

// Current position is stored under `myUuid` node
navigator.geolocation.watchPosition(function(position) {
  markersRef.child(myUuid).set({
    coords: {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    },
    timestamp: Math.floor(Date.now() / 1000)
  })
})
```

Now the only thing left is to add markers on the map.
To do this I listen on every events happening on the current map endpoint.
In the example below `addPoint()`, `putPoint()` and `removePoint()` are
simple functions to add, update or remove a marker in the map.

```js
markersRef.on('child_added', function(childSnapshot) {
  var uuid = childSnapshot.key()
  var position = childSnapshot.val()

  addPoint(uuid, position)
})

markersRef.on('child_changed', function(childSnapshot) {
  var uuid = childSnapshot.key()
  var position = childSnapshot.val()

  putPoint(uuid, position)
})

markersRef.on('child_removed', function(oldChildSnapshot) {
  var uuid = oldChildSnapshot.key()

  removePoint(uuid)
})
```

That's pretty much it. It was easy, right?

If you want to hack on it, checkout the code on [github.com/MattKetmo/firemap](https://github.com/MattKetmo/firemap/blob/v1.0.0/app.js).
You can also find other demo applications of Firebase at [firebase.github.io](https://firebase.github.io/),
like this [real-time bus tracking in San Francisco](https://geofire.firebaseapp.com/sfVehicles/index.html).
