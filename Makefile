develop:
	npx webpack serve

install:
	npm ci

build:
	rm -rf dist
	NODE_ENV=production npx webpack

test:
	npx jest

test-coverage:
	npx jest --coverage
	
lint:
	npx eslint .

.PHONY: test
