
test:
	docker run -it --rm -v $(shell pwd):/app -w /app --ipc=host mcr.microsoft.com/playwright:v1.50.1-noble npx playwright test

