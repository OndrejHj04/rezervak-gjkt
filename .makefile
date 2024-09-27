.PHONY: build deploy

PORT=27210

deploy:
    rsync -av -e "ssh -p ${PORT}" --delete --exclude .git/ --exclude node_modules/ --exclude .next/ ./ app@ssh.rosti.cz:/srv/app/
    ssh -p ${PORT} app@ssh.rosti.cz "cd app && npm install && npm run build && supervisorctl restart app"