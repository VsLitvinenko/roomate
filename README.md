# roomate
node.js 16.13.0 <br/>
``npm i`` (можно добавить --force в случае опасности) <br/>
``npm install -g @angular/cli`` - глобально ставим cli ангуляра, чтобы пользоваться ng serve<br/>
``ng serve`` - user id=2 <br/>
``ng serve --configuration=user1`` - user id=1 <br/>
``ng serve --configuration=user2`` - user id=3 <br/>
(необязательные параметры сборки ``--host=192.168.x.x`` ``--port=xxxx``  ``--ssl``) <br/>
<br/>
окружение для rest указано в файле ``src/proxy.conf.json`` <br/>
окружение для janus и signalR в файле ``src/environments/environment.ts``
