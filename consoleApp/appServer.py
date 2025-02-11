'''
POST Body:
{
  "csv_file": "path_to_your_file/investor_data.csv",
  "embedding_file": "path_to_your_file/investorEmbeddings.npy",
  "query": "List investors who prefer the Technology sector"
}

Result:
{
    "result": "Here is the list of investors who prefer the Technology sector: ..."
}
'''

from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import openai
import faiss

app = Flask(__name__)

with open('apiKey.bin', 'r') as f:
    apiKey = f.read() 
openai.api_key = apiKey

def get_batch_embeddings(texts, model="text-embedding-ada-002"):
    response = openai.Embedding.create(input=texts, model=model)
    return np.array([data['embedding'] for data in response['data']])

def build_faiss_index(embeddings):
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)
    return index

def search_faiss(query, index, k=17):
    query_embedding = get_batch_embeddings([query])
    distances, indices = index.search(query_embedding, k)
    return indices[0], distances[0]

def query_gpt_4o_mini(query, retrieved_indices, df):
    retrieved_data = "\n".join([str(df.iloc[idx].to_dict()) for idx in retrieved_indices])
    
    prompt = f"""
    You are an expert AI assistant specialized in analyzing startup / investor data. Your task is to provide concise, relevant, and actionable answers to the user query based on the provided data.

    Data context:
    {retrieved_data}

    User Query: "{query}"

    Your answer should directly address the user's query based on the context and data provided. If the answer is not explicitly found, provide the most relevant information or indicate uncertainty.
    """
    
    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a highly efficient AI assistant focused on delivering quick and accurate responses related to startup / investor data."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.2,
        max_tokens=150, 
        top_p=1.0, 
        frequency_penalty=0.0, 
        presence_penalty=0.0 
    )
    return response['choices'][0]['message']['content']

def perform_query(query, index, df):
    indices, distances = search_faiss(query, index)
    answer = query_gpt_4o_mini(query, indices, df)
    return answer

@app.route('/query', methods=['POST'])
def query():
    if 'csv_file' not in request.files or 'embedding_file' not in request.files:
        return jsonify({"error": "CSV file and embedding file are required."}), 400
    
    csv_file = request.files['csv_file']
    embedding_file = request.files['embedding_file']
    query_text = request.form['query']
    df = pd.read_csv(csv_file)
    embeddings = np.load(embedding_file)
    index = build_faiss_index(embeddings)
    result = perform_query(query_text, index, df)
    return jsonify({"result": result})

if __name__ == '__main__':
    app.run(debug=True)