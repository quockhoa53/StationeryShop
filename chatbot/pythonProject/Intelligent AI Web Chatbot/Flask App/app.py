from flask import Flask, request, jsonify, redirect
from flask_cors import CORS
from utils import get_response, predict_class

app = Flask(__name__, template_folder='templates')
# Explicitly configure CORS for all routes
CORS(app, 
     origins=["http://localhost:5173"], 
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "OPTIONS"])

# Add error handling for debugging
@app.errorhandler(Exception)
def handle_error(error):
    app.logger.error(f"Error occurred: {str(error)}")
    return jsonify({"error": "Internal server error", "message": str(error)}), 500

@app.route('/')
def index():
    return redirect("http://localhost:5173", code=302)

@app.route('/handle_message', methods=['POST'])
def handle_message():
    try:
        # Validate incoming JSON
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400
        
        data = request.get_json()
        if 'message' not in data:
            return jsonify({"error": "Missing 'message' in JSON payload"}), 400

        message = data['message']
        intents_list = predict_class(message)
        raw_response = get_response(intents_list, message)

        # Format the response
        formatted_response = format_response(raw_response)
        return jsonify({'response': formatted_response})
    
    except Exception as e:
        app.logger.error(f"Error in handle_message: {str(e)}")
        return jsonify({"error": "Internal server error", "message": str(e)}), 500

def format_response(raw_response):
    try:
        lines = raw_response.split('\n')
        html = '<div class="formatted-response">'
        in_list = False

        for line in lines:
            line = line.strip()
            if not line:
                if in_list:
                    html += '</ul>'
                    in_list = False
                continue

            if line.startswith('**') and line.endswith('**'):
                if in_list:
                    html += '</ul>'
                    in_list = False
                html += f'<h3>{line[2:-2]}</h3>'
            elif line.startswith('*'):
                if not in_list:
                    html += '<ul>'
                    in_list = True
                html += f'<li>{line[2:]}</li>'
            elif line.startswith('```php'):
                if in_list:
                    html += '</ul>'
                    in_list = False
                code_content = []
                for next_line in lines[lines.index(line) + 1:]:
                    if next_line.startswith('```'):
                        break
                    code_content.append(next_line)
                html += '<pre><code>' + '\n'.join(code_content) + '</code></pre>'
            else:
                if in_list:
                    html += '</ul>'
                    in_list = False
                html += f'<p>{line}</p>'

        if in_list:
            html += '</ul>'
        html += '</div>'

        html = html.replace('**', '')
        return html
    except Exception as e:
        app.logger.error(f"Error in format_response: {str(e)}")
        raise e

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)