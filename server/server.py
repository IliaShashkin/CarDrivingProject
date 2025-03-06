from flask import Flask, jsonify, render_template, request
import json

app = Flask(__name__)

leaderboard_file_path = 'data/leaderboard.json'

# Endpoint to serve leaderboard
@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    content = load_leaderboard()
    
    cleaned_content = []
    for entry in content:
        cleaned_entry = {
            'name': entry['name'],
            'score': entry['score']
        }
        cleaned_content.append(cleaned_entry)
    return jsonify(cleaned_content), 200

@app.route('/leaderboard', methods=['POST'])
def post_leaderboard():
    try:
        content = load_leaderboard()
        
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form

        name = data['name']
        score = int(data['score'])
        ip_address = request.headers.get('CF-Connecting-IP') or \
                    request.headers.get('X-Real-IP') or \
                    request.headers.get('X-Forwarded-For') or \
                    request.remote_addr

        if score < 0:
            return jsonify({'status': 'error', 'message': 'Invalid score'}), 200

        for i in content:
            if i['name'] == name:
                i['score'] = score
                write_leaderboard(content)
                return jsonify({'status': 'success'}), 200

        content.append({'name': name, 'score': score, 'ip_address': ip_address})
        content.sort(key=lambda x: x['score'], reverse=False)
        
        write_leaderboard(content)
        return jsonify({'status': 'success'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/leaderboard', methods=['DELETE'])
def delete_leaderboard():
    try:
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form

        name_to_delete = data['name']
        content = load_leaderboard()
        content = [i for i in content if i['name'] != name_to_delete]
        write_leaderboard(content)
        return jsonify({'status': 'success'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# Web UI
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/authenticate', methods=['POST'])
def authenticate():
    try:
        password = request.form['password']
        if password == 'memgame':
            return jsonify({'status': 'success'}), 200
        else:
            return jsonify({'status': 'error', 'message': 'Invalid password'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

def load_leaderboard():
    try:
        with open(leaderboard_file_path, 'r') as file:
            content = json.load(file)
        return content
    except Exception as e:
        return []
    
def write_leaderboard(content):
    try:
        with open(leaderboard_file_path, 'w') as file:
            json.dump(content, file)
    except Exception as e:
        return str(e)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9501)
