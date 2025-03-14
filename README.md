## **🔹 Step 1: Clone the Repository**
On your new system, open a terminal and run:  

```powershell
git clone https://github.com/your-username/Zocket-Assignment-New.git
```
Replace `your-username` with your GitHub username and `Zocket-Assignment-New` with your repository name.  

Once cloned, navigate into the project folder:  

```powershell
cd Zocket-Assignment-New
```

---

## **🔹 Step 2: Install Dependencies**
If your project is using **Node.js**, install dependencies:  

```powershell
npm install
```
or if using **yarn**:  

```powershell
yarn install
```

If your project has both **frontend and backend** folders, install dependencies in each:  

```powershell
cd frontend
npm install
cd ../backend
npm install
```

---

## **🔹 Step 3: Set Up Environment Variables (if needed)**
Check if there is a `.env.example` or `.env` file. If required, create a `.env` file:  

```powershell
cp .env.example .env
```

Edit the `.env` file and add necessary values.

---

## **🔹 Step 4: Run the Project**
### **If It’s a React/Vue/Angular Frontend**
Move to the frontend directory and start the development server:  

```powershell
cd frontend
npm start
```
or  

```powershell
npm run dev
```
The frontend should now be running at `http://localhost:3000` (or the port defined in your project).

---

### **If It’s an Express/Django/Flask Backend**
Move to the backend directory and start the backend server:  

#### **For Node.js (Express.js)**
```powershell
cd backend
npm start
```
or  

```powershell
npm run dev  # If using nodemon
```

#### **For Python (Django)**
```powershell
cd backend
python manage.py runserver
```

---

## **🔹 Step 5: Access the App**
- **Frontend** → Open `http://localhost:3000` in your browser.  
- **Backend API** → Check `http://localhost:5000` or `http://127.0.0.1:8000` (depends on your backend framework).  

---

## **🔹 Step 6: Make Changes & Push to GitHub**
If you make any changes and want to upload them back to GitHub:  

```powershell
git add .
git commit -m "Updated project"
git push origin main
git clone https://github.com/your-username/Zocket-Assignment-New.git
cd Zocket-Assignment-New
npm install
cd frontend && npm install && cd ../backend && npm install
cp .env.example .env  # If environment variables are needed
cd frontend && npm start  # Run frontend
cd backend && npm start  # Run backend
