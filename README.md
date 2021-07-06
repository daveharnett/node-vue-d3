A demonstration of a d3/vue frontend with mqtt-brokered data sources and nodejs server.

- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Remarks](#remarks)
- [Done](#done)
- [ToDo](#todo)
- [Further Work](#further-work)

# Architecture
emitter <=>  
emitter <=>      mqtt broker     <=>    frontend server     <=> client  
emitter <=>  





# Getting Started
From the workspace root, run:
> docker-compose -f "docker-compose.yml" up -d --build 

or for debug, run:
> docker-compose -f "docker-compose.debug.yml" up -d --build 


# Testing
> npm run test


# Remarks
 - The Emitter is about as done as I want it (based on the scope/time alotted to this assignment).
 - The MQTT client wrappers smell of oo developer. The syntactic sugar is nice, but i think a functional pattern will scan better for js devs.
 - The frontend and client-side is unfinished to say the least. Lots to learn in Vue and d3.

# Done
 - Emitter project (which would run on each 'site') generates random values from 44 to 55.
 - Emitter publishes values to mqtt broker.
 - Emitter simulates failure randomly.
 - Emitter publishes it's state to mqtt (including will to indicate when it's down).
 - Emitter can be restarted via mqtt channel.
 - Added Docker compose.
 - Added multiple Emitter containers to docker compose.
 - Added MQTT broker to docker compose.
 - Configure Emitters to publish to internal mqtt broker.
 - Added frontend project.
 - Added mqtt client to frontend - subscribe to emitter values/statuses.
 - Added socket.io and event broker to frontend - passes values from mqtt to end-user websocket.


# ToDo
 - Create a repository on the frontend server to store Emitter names/states, so users can get a comprehensive list on connect.
 - Add vue.js element to display emitter names/states.
 - Add vue.js restart button for each emitter.
 - Add d3.js time series chart to display emitter values.
 - Add toast/notification when an emitter goes offline.
 - Hoist docker compose file to k8s.
 - Add a mechanism to clean up retained messages for dead sites.

# Further Work
 - Logging
 - DI?
 - Add a repository to frontend server to store the last 3 minutes of values. Send to users on load, so graph is immediately populated.