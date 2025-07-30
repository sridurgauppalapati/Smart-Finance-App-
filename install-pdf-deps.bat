@echo off
echo Installing PDF processing dependencies...

cd Server
npm install pdf-parse multer

cd ../Client  
npm install react-dropzone

echo Dependencies installed successfully!
pause