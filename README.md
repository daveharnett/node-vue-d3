A demonstration of a d3/vue frontend with mqtt-brokered data sources and nodejs server.

- [Architecture](#architecture)
- [Remarks](#remarks)
- [ToDo](#todo)

# Architecture
emitter <=>  
emitter <=>      mqtt broker     <=>    frontend server     <=> client  
emitter <=>  













# Remarks
 - The MQTT client wrappers smell of oo developer. The syntactic sugar is nice, but i'm not sure it's familiar to js programmers.


# ToDo
 - Add a mechanism to clean up retained messages for dead sites.