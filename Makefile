develop:
	npx webpack serve

install:
	npm ci

build:
	rm -rf dist
	NODE_ENV=production npx webpack

test-watch:
	node --experimental-vm-modules 'node_modules/.bin/jest' --watch
test-coverage:
	NODE_OPTIONS=--experimental-vm-modules  npx jest --coverage
test:
	NODE_OPTIONS=--experimental-vm-modules  npx jest
pwd:
	pwd
lint:
	npx eslint .

.PHONY: test

add:
	git add .
commit:

	git commit -m '$${RANDOM}'
