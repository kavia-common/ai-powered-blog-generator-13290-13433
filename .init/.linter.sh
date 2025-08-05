#!/bin/bash
cd /home/kavia/workspace/code-generation/ai-powered-blog-generator-13290-13433/AIPoweredBlogGeneratorMonolith
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

