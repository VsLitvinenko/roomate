# roomate
node.js 16.13.0 <br/>
``npm install`` (можно добавить ``--force`` в случае опасности) <br/>
``npm install -g @angular/cli`` - глобально ставим cli ангуляра, чтобы работал ng serve<br/>
``npm run start:slavik`` - user id=2 <br/>
``npm run start:toha`` - user id=1 <br/>
``npm run start:polya`` - user id=3 <br/>
<br/>
необязательные параметры сборки (только при использовании ``ng serve``) <br/>
``--host=192.168.x.x`` ``--port=xxxx``  ``--ssl`` <br/>
<br/>
окружение для rest указано в файле ``src/proxy.conf.json`` <br/>
окружение для janus и signalR в файле ``src/environments/environment.ts``
