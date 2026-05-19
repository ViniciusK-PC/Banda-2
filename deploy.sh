#!/bin/bash

# Remove directory if exists for clean install
rm -rf banda

# Clone the repository
git clone https://github.com/ViniciusK-PC/Banda-2.git banda
cd banda

# Create environment files
cat << 'EOF' > api/.env
MONGODB_URI=mongodb+srv://viniciuskb35_db_user:gzUmzbTGlqpb36j2@cluster0.wfu33fp.mongodb.net/banda_db?appName=Cluster0
JWT_SECRET=super_secret_jwt_key_for_banda_api
PORT=5000
EOF

cat << 'EOF' > web/.env.local
NEXT_PUBLIC_API_URL=http://ec2-54-209-111-28.compute-1.amazonaws.com
NEXTAUTH_SECRET=super_secret_nextauth_key_for_banda_web
NEXTAUTH_URL=http://ec2-54-209-111-28.compute-1.amazonaws.com
EOF

# Install dependencies and build API
echo "Building API..."
cd api
npm install
npm run build

# Install dependencies and build Web
echo "Building Web..."
cd ../web
npm install
npm run build

# Start services using PM2
echo "Starting services..."
cd ..
sudo npm install -g pm2
pm2 stop all || true
pm2 delete all || true
pm2 start ecosystem.config.js
pm2 save

# Setup Nginx
echo "Configuring Nginx..."
# Modify the Nginx template to use the EC2 domain instead of the placeholder
sed -i 's/seu-dominio.com www.seu-dominio.com;/ec2-54-209-111-28.compute-1.amazonaws.com;/g' nginx_banda.conf

sudo cp nginx_banda.conf /etc/nginx/sites-available/banda
sudo ln -sf /etc/nginx/sites-available/banda /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

echo "DEPLOYMENT COMPLETE!"
