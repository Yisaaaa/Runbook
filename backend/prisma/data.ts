import { RunbookPrivacy } from 'src/generated/prisma/enums';
import { RunbookUncheckedCreateInput } from 'src/generated/prisma/models/Runbook';

export const userData = {
  email: 'marleybob@gmail.com',
  username: 'bobmarley',
};

export const runbooksData: Omit<RunbookUncheckedCreateInput, 'userId'>[] = [
  {
    title: 'Sorting Algorithms Visualized in Python',
    content: `# Sorting Algorithms in Python

Visualizing how different sorting algorithms work step by step.

\`\`\`file python utils.py
def is_sorted(arr):
    return all(arr[i] <= arr[i+1] for i in range(len(arr)-1))

def generate_random(n, max_val=100):
    import random
    return [random.randint(0, max_val) for _ in range(n)]
\`\`\`

## Bubble Sort

\`\`\`runnable python
import time

arr = [64, 34, 25, 12, 22, 11, 90]
n = len(arr)

for i in range(n):
    for j in range(0, n-i-1):
        if arr[j] > arr[j+1]:
            arr[j], arr[j+1] = arr[j+1], arr[j]
    print(f"Pass {i+1}: {arr}")
    time.sleep(0.5)

print(f"Sorted: {arr}")
\`\`\`

## Using Helper Functions

\`\`\`runnable python
from utils import is_sorted, generate_random

arr = generate_random(10)
print(f"Before: {arr}")
arr.sort()
print(f"After: {arr}")
print(f"Is sorted: {is_sorted(arr)}")
\`\`\``,
    privacy: RunbookPrivacy.PRIVATE,
    shareToken: 'laksj234jq0dasf',
  },

  {
    title: 'File I/O and Text Processing',
    content: `# Text Processing in Python

Reading, writing, and processing text files.

\`\`\`file python config.py
STOP_WORDS = ['the', 'a', 'an', 'is', 'it', 'in', 'on', 'at', 'to', 'for']

def clean_word(word):
    return word.lower().strip('.,!?')
\`\`\`

## Word Counter

\`\`\`runnable python
import sys
sys.path.insert(0, '/tmp')
from config import STOP_WORDS, clean_word

text = """
The quick brown fox jumps over the lazy dog.
It is a simple sentence used for testing purposes.
"""

words = [clean_word(w) for w in text.split()]
filtered = [w for w in words if w and w not in STOP_WORDS]

freq = {}
for word in filtered:
    freq[word] = freq.get(word, 0) + 1

for word, count in sorted(freq.items(), key=lambda x: -x[1]):
    print(f"{word}: {count}")
\`\`\`

## Writing to a File

\`\`\`runnable bash
echo "Hello from Bash" > /tmp/output.txt
echo "Second line" >> /tmp/output.txt
cat /tmp/output.txt
\`\`\``,

    privacy: RunbookPrivacy.PRIVATE,
    shareToken: 'avasdklagb231bl',
  },

  {
    title: 'Node.js API Client',
    content: `# REST API Client in Node.js

Fetching and processing data from a public API.

\`\`\`file javascript helpers.js
function formatPost(post) {
    return \`[\${post.id}] \${post.title}\n  \${post.body.slice(0, 50)}...\`
}

module.exports = { formatPost }
\`\`\`

## Fetch Posts

\`\`\`runnable node
const https = require('https')

const options = {
  hostname: 'jsonplaceholder.typicode.com',
  path: '/posts?_limit=5',
  method: 'GET'
}

const req = https.request(options, (res) => {
  let data = ''
  res.on('data', chunk => data += chunk)
  res.on('end', () => {
    const posts = JSON.parse(data)
    const { formatPost } = require('/tmp/helpers')
    posts.forEach(p => console.log(formatPost(p)))
  })
})

req.end()
\`\`\`

## Fetch Users

\`\`\`runnable node
const https = require('https')

const options = {
  hostname: 'jsonplaceholder.typicode.com',
  path: '/users?_limit=3',
  method: 'GET'
}

const req = https.request(options, (res) => {
  let data = ''
  res.on('data', chunk => data += chunk)
  res.on('end', () => {
    const users = JSON.parse(data)
    users.forEach(u => {
      console.log(\`\${u.name}\`)
      console.log(\`Email: \${u.email}\`)
      console.log(\`Company: \${u.company.name}\`)
    })
  })
})

req.end()
\`\`\`
`,
    privacy: RunbookPrivacy.PUBLIC,
    shareToken: 'dafsd324',
  },
];
