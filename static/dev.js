// ===============================
// PASSWORD PROTECTION - LOGIN PAGE
// TO REMOVE: Delete this file and remove script tag from HTML before launch
// ===============================

// Check if already authenticated
if (sessionStorage.getItem('authenticated') !== 'true') {
    // Hide original content and show login page
    document.addEventListener('DOMContentLoaded', function() {
        // Store original content
        const originalContent = document.body.innerHTML;
        
        // Create login page
        document.body.innerHTML = `
            <div style="
                min-height: 100vh;
                background: linear-gradient(135deg, #1a1a1a 0%, #2d1b69 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'IBM Plex Sans Arabic', Arial, sans-serif;
                margin: 0;
                padding: 20px;
                box-sizing: border-box;
            ">
                <div style="
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 20px;
                    padding: 40px;
                    text-align: center;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    max-width: 400px;
                    width: 100%;
                ">
                    <h1 style="
                        color: white;
                        margin-bottom: 10px;
                        font-size: 32px;
                        font-weight: 600;
                    ">🔒</h1>
                    <h2 style="
                        color: white;
                        margin-bottom: 10px;
                        font-size: 24px;
                        font-weight: 600;
                    ">صفحة محمية</h2>
                    <p style="
                        color: rgba(255, 255, 255, 0.8);
                        margin-bottom: 30px;
                        font-size: 16px;
                        line-height: 1.5;
                    ">يرجى إدخال كلمة المرور للوصول إلى الموقع</p>
                    
                    <input 
                        type="password" 
                        id="password-field" 
                        placeholder="كلمة المرور"
                        style="
                            width: 100%;
                            padding: 15px;
                            border: 2px solid rgba(130, 54, 252, 0.5);
                            border-radius: 10px;
                            background: rgba(255, 255, 255, 0.1);
                            color: white;
                            font-size: 16px;
                            margin-bottom: 20px;
                            text-align: center;
                            outline: none;
                            box-sizing: border-box;
                        "
                    />
                    
                    <button 
                        id="login-btn"
                        style="
                            width: 100%;
                            padding: 15px;
                            background: linear-gradient(45deg, #8236fc, #6c2bd9);
                            color: white;
                            border: none;
                            border-radius: 10px;
                            font-size: 16px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            box-sizing: border-box;
                        "
                        onmouseover="this.style.transform='scale(1.05)'"
                        onmouseout="this.style.transform='scale(1)'"
                    >دخول</button>
                    
                    <div 
                        id="error-msg" 
                        style="
                            color: #ff6b6b;
                            font-size: 14px;
                            margin-top: 15px;
                            display: none;
                        "
                    >كلمة المرور غير صحيحة</div>
                </div>
            </div>
        `;
        
        // Handle login
        const passwordField = document.getElementById('password-field');
        const loginBtn = document.getElementById('login-btn');
        const errorMsg = document.getElementById('error-msg');
        
        function checkLogin() {
            const password = passwordField.value;
            if (password === 'dev@11oct') {
                sessionStorage.setItem('authenticated', 'true');
                document.body.innerHTML = originalContent;
                // Re-run scripts after restoring content
                const scripts = document.querySelectorAll('script');
                scripts.forEach(script => {
                    if (script.src && !script.src.includes('dev.js')) {
                        const newScript = document.createElement('script');
                        newScript.src = script.src;
                        document.head.appendChild(newScript);
                    }
                });
            } else {
                errorMsg.style.display = 'block';
                passwordField.style.borderColor = '#ff6b6b';
                passwordField.value = '';
                setTimeout(() => {
                    errorMsg.style.display = 'none';
                    passwordField.style.borderColor = 'rgba(130, 54, 252, 0.5)';
                }, 3000);
            }
        }
        
        loginBtn.addEventListener('click', checkLogin);
        passwordField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                checkLogin();
            }
        });
        
        // Focus on password field
        setTimeout(() => passwordField.focus(), 100);
    });
}

// ===============================
// END PASSWORD PROTECTION
// ===============================