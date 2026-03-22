# Service Contracts Repository

## CAREFULLY READ FULL GUIDELINES

### Integration Steps

Steps to integrate service contracts from the central services repository to your main project:

- Run the command: `git submodule add <service_contracts_repo_url> <local_file_path>`
- Set local file path as `./app/proto`
- **Important:** Do not create proto folder inside the app directory before running this command
- After successful integration, push the latest updates of your project with submodule to the remote repository

### Important Rules (Must Follow)

- Do not manually edit the proto files inside your main project
- To modify service contracts, clone the service-contracts repository and make changes there
- Push your changes to the remote repo of service-contracts
- Follow the same process for creating new service proto files
- **After any changes to service-contracts**, update the GitHub submodule in your main project using:
  ```bash
  git submodule update --remote --merge
  ```
- Push your latest updates to your main remote repository
- Following these practices ensures consistency of service contracts across the entire Microservices project

---

## Code Generation from Proto Files

### Python

**Step 1: Install Dependencies**

Install required packages:
```bash
pip install grpcio-tools
```
or
```bash
uv add grpcio-tools
```

**Step 2: Generate Code**

Run the following command:
```bash
python -m grpc_tools.protoc -I ./app/protos --python_out=./app/generated --grpc_python_out=./app/generated ./app/protos/*/*.proto
```

This generates native code files inside `./app/generated`:
- `*_pb2.py` → message definitions
- `*_pb2_grpc.py` → service & stub definitions

**Alternative Method: Using Make**

If you have the `make` tool installed:

For Windows:
```bash
choco install make
```

For macOS:
```bash
brew install make
```

Create a `Makefile` in the project root with:
```makefile
proto:
	python -m grpc_tools.protoc \
	-I ./app/protos \
	--python_out=./app/generated \
	--grpc_python_out=./app/generated \
	./app/protos/*/*.proto
```

Then run:
```bash
make proto
```

### JavaScript/Node.js

**Step 1: Install Dependencies**

```bash
npm i @grpc/grpc-js --save-dev grpc-tools
```

**Step 2: Generate Code**

Run the following command:
```bash
npx grpc_tools_node_protoc \
  --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
  --js_out=import_style=commonjs,binary:./app/generated \
  --grpc_out=grpc_js:./app/generated \
  --ts_out=grpc_js:./app/generated \
  -I ./app/protos \
  ./app/protos/*/*.proto
```

This generates native code files inside `./app/generated` with files for each service.

**Alternative Method: Using Make**

If you have the `make` tool installed, create a `Makefile` with:
```makefile
proto:
	npx grpc_tools_node_protoc \
	  --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
	  --js_out=import_style=commonjs,binary:./app/generated \
	  --grpc_out=grpc_js:./app/generated \
	  --ts_out=grpc_js:./app/generated \
	  -I ./app/protos \
	  ./app/protos/*/*.proto
```

Then run:
```bash
make proto
```

---

## Thank You
