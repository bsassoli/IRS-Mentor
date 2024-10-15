from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

questions = [
    {"text": "Non sta piovendo", "solution": "\\neg P"},
    {"text": "Se piove, allora la strada è bagnata", "solution": "P \\rightarrow Q"},
    {"text": "Il cielo è nuvoloso e sta piovendo", "solution": "P \\land Q"},
    # Add more questions here
]

current_question_index = 0

@app.route('/api/questions', methods=['GET'])
def get_question():
    global current_question_index
    question = questions[current_question_index]
    current_question_index = (current_question_index + 1) % len(questions)
    return jsonify(question)

@app.route('/api/check-solution', methods=['POST'])
def check_solution():
    data = request.json
    user_solution = data.get('userSolution', '').strip()
    correct_solution = data.get('correctSolution', '').strip()
    is_correct = user_solution == correct_solution
    return jsonify({"correct": is_correct})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

