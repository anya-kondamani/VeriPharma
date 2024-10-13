from flask import Flask, request, jsonify
from supabase import create_client, Client
import bcrypt
import requests  # For making HTTP requests to the blockchain verification service

# Supabase configuration
url = "https://pjmuerlkiilsdnkmvniq.supabase.co"  # Replace with your Supabase URL
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqbXVlcmxraWlsc2Rua212bmlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3MDU5MTcsImV4cCI6MjA0NDI4MTkxN30.jAj1z9Vj8VJ1zOBnXdyLGE2Bp0IlTPPkbPILOOz8fhY"  # Replace with your Supabase Anon Key

supabase: Client = create_client(url, key)

app = Flask(__name__)

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    user_type = data.get('user_type')

    if user_type not in ['client', 'retailer', 'manufacturer']:
        return jsonify({'message': 'Invalid user type'}), 400

    username = data.get('username')
    password = data.get('password')
    confirm_password = data.get('confirm_password')
    wallet_address = data.get('wallet_address')

    # Common field validation
    required_fields = [username, password, confirm_password, wallet_address]
    if not all(required_fields):
        return jsonify({'message': 'All fields are required'}), 400

    if password != confirm_password:
        return jsonify({'message': 'Passwords do not match'}), 400

    # Check if the username already exists
    existing_user = supabase.table('users').select('*').eq('username', username).execute().data
    if existing_user:
        return jsonify({'message': 'Username already exists'}), 400

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Prepare the data to insert based on user type
    user_data = {
        'user_type': user_type,
        'username': username,
        'password_hash': hashed_password.decode('utf-8'),
        'wallet_address': wallet_address
    }

    if user_type == 'client':
        # Client-specific fields
        first_name = data.get('first_name')
        middle_name = data.get('middle_name')
        last_name = data.get('last_name')
        insurance_carrier = data.get('insurance_carrier')

        client_required_fields = [first_name, last_name, insurance_carrier]
        if not all(client_required_fields):
            return jsonify({'message': 'All client fields are required'}), 400

        user_data.update({
            'first_name': first_name,
            'middle_name': middle_name,
            'last_name': last_name,
            'insurance_carrier': insurance_carrier
        })

    elif user_type == 'retailer':
        # Retailer-specific fields
        retailer_name = data.get('retailer_name')
        business_address = data.get('business_address')
        business_phone = data.get('business_phone')
        business_email = data.get('business_email')
        tax_id = data.get('tax_id')
        business_license = data.get('business_license')
        industry = data.get('industry')

        retailer_required_fields = [retailer_name, business_address, business_phone, business_email, tax_id]
        if not all(retailer_required_fields):
            return jsonify({'message': 'All retailer fields are required'}), 400

        user_data.update({
            'retailer_name': retailer_name,
            'business_address': business_address,
            'business_phone': business_phone,
            'business_email': business_email,
            'tax_id': tax_id,
            'business_license': business_license,
            'industry': industry
        })

    elif user_type == 'manufacturer':
        # Manufacturer-specific fields
        manufacturer_name = data.get('manufacturer_name')
        company_address = data.get('company_address')
        company_phone = data.get('company_phone')
        company_email = data.get('company_email')
        tax_id = data.get('tax_id')
        business_license = data.get('business_license')
        product_category = data.get('product_category')

        manufacturer_required_fields = [manufacturer_name, company_address, company_phone, company_email, tax_id]
        if not all(manufacturer_required_fields):
            return jsonify({'message': 'All manufacturer fields are required'}), 400

        user_data.update({
            'manufacturer_name': manufacturer_name,
            'company_address': company_address,
            'company_phone': company_phone,
            'company_email': company_email,
            'tax_id': tax_id,
            'business_license': business_license,
            'product_category': product_category
        })

    # Insert the new user into the Supabase users table
    response = supabase.table('users').insert(user_data).execute()

    if response.data:
        return jsonify({'message': 'User created successfully'}), 201
    else:
        return jsonify({'message': 'Error creating user', 'details': response.error}), 400
    
@app.route('/profile/<int:user_id>', methods=['GET'])
def get_profile(user_id):
    user = supabase.table('users').select('first_name', 'middle_name', 'last_name', 'insurance_carrier').eq('user_id', user_id).execute().data
    if user:
        return jsonify({'profile': user[0]}), 200
    else:
        return jsonify({'message': 'User not found'}), 404
    
@app.route('/products/<int:user_id>', methods=['GET'])
def get_user_products(user_id):
    products = supabase.table('products').select('*').eq('user_id', user_id).execute().data
    if products:
        # For each product, check real-time verification status
        updated_products = []
        for product in products:
            serial_number = product['serial_number']
            is_verified = check_product_verification(serial_number)
            status_changed = False  # Initialize status_changed for each product

            if is_verified != product['is_verified']:
                # Update the is_verified status in the database
                supabase.table('products').update({'is_verified': is_verified}).eq('product_id', product['product_id']).execute()
                # Set status_changed to True since the status has changed
                status_changed = True
                #ALERT TO FRONTEND A WARNING

            # Update the product dictionary
            product['is_verified'] = is_verified
            product['status_changed'] = status_changed  # Assign outside the if block
            updated_products.append(product)

        return jsonify({'products': updated_products}), 200
    else:
        return jsonify({'message': 'No products found for this user'}), 404
    
def check_product_verification(serial_number):
    # Replace the URL and logic with your actual implementation
    # # For example, make a request to your blockchain verification service
    # verification_service_url = "https://your-blockchain-service.com/verify"
    # response = requests.post(verification_service_url, json={'serial_number': serial_number})
    # if response.status_code == 200:
    #     data = response.json()
    #     is_verified = data.get('is_verified', False)
    #     return is_verified
    # else:
    #     # Handle error cases as needed
    #     return False
    return False

@app.route('/add_product', methods=['POST'])
def add_product():
    data = request.get_json()
    user_id = data.get('user_id')
    serial_number = data.get('serial_number')
    product_name = data.get('product_name')

    if not user_id or not serial_number:
        return jsonify({'message': 'User ID and serial number are required'}), 400

    # Check if the product already exists for this user
    existing_product = supabase.table('products').select('*').eq('user_id', user_id).eq('serial_number', serial_number).execute().data
    if existing_product:
        return jsonify({'message': 'Product already exists in your list'}), 400

    # Check the initial verification status
    is_verified = check_product_verification(serial_number)

    # Insert the product into the database
    response = supabase.table('products').insert({
        'user_id': user_id,
        'serial_number': serial_number,
        'product_name': product_name,
        'is_verified': is_verified
    }).execute()

    if response.data:
        return jsonify({'message': 'Product added successfully', 'is_verified': is_verified}), 201
    else:
        return jsonify({'message': 'Error adding product', 'details': response.error}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Fetch user data from Supabase using username
    user = supabase.table('users').select('*').eq('username', username).execute().data

    if user and bcrypt.checkpw(password.encode('utf-8'), user[0]['password_hash'].encode('utf-8')):
        return jsonify({'message': 'Login successful', 'user_id': user[0]['user_id']}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401
    
@app.route('/search_prescription', methods=['POST'])
def search_prescription():
    data = request.get_json()
    prescription_name = data.get('prescription_name')
    batch_number = data.get('batch_number')
    barcode_image = data.get('barcode_image')

    # Mock search logic
    if prescription_name or batch_number or barcode_image:
        prescription_info = {
            'name': 'Sample Medicine',
            'dosage': '500mg',
            'manufacturer': 'Pharma Inc.'
        }
        return jsonify({'prescription_info': prescription_info}), 200
    else:
        return jsonify({'message': 'No search criteria provided'}), 400

@app.route('/submit_insurance', methods=['POST'])
def submit_insurance():
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    insurance_provider = data.get('insurance_provider')
    policy_number = data.get('policy_number')
    allergies = data.get('allergies')
    user_id = data.get('user_id')  # Assuming the user ID is sent from the frontend

    # Insert insurance info into Supabase
    response = supabase.table('insurance_info').insert({
        'user_id': user_id,
        'insurance_provider': insurance_provider,
        'policy_number': policy_number,
        'allergies': allergies
    }).execute()

    # Check if the response contains data
    if response.data:
        return jsonify({'message': 'Insurance information submitted successfully'}), 201
    else:
        return jsonify({'message': 'Error submitting insurance information', 'details': response.error}), 400

# Other routes...

if __name__ == '__main__':
    app.run(debug=True)
