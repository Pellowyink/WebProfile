// Universal Loading Animation - Just add this script to any HTML file!
(function() {
    'use strict';
    
    // Create loading overlay HTML
    const loaderHTML = `
        <div id="universal-loader" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #932c30, #b8363b);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 99999;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        ">
            <div style="text-align: center; color: white;">
                <!-- Spinning Cat Image -->
                <div style="
                    width: 100px;
                    height: 100px;
                    margin: 0 auto 20px;
                    position: relative;
                    animation: catSpin 1.3s smooth infinite;
                ">
                    <img id="spinning-cat" src="images/pawprint-up.png" alt="Loading Cat" style="
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5));
                        animation: bounce 2s ease-in-out infinite;
                    " onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    
                    <!-- Fallback spinner if image doesn't load -->
                    <div style="
                        width: 80px;
                        height: 80px;
                        border: 4px solid rgba(255, 215, 0, 0.3);
                        border-top: 4px solid #FFD700;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 10px auto;
                        display: none;
                    "></div>
                </div>
                
                <!-- Loading Text -->
                <div style="
                    font-family: 'Arial', sans-serif;
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    animation: pulse 2s ease-in-out infinite;
                ">Loading...</div>
                
                <!-- Loading Dots -->
                <div style="
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                ">
                    <div style="
                        width: 12px;
                        height: 12px;
                        background: #FFD700;
                        border-radius: 50%;
                        animation: bounce 1.4s ease-in-out infinite both;
                        animation-delay: -0.32s;
                    "></div>
                    <div style="
                        width: 12px;
                        height: 12px;
                        background: #FFD700;
                        border-radius: 50%;
                        animation: bounce 1.4s ease-in-out infinite both;
                        animation-delay: -0.16s;
                    "></div>
                    <div style="
                        width: 12px;
                        height: 12px;
                        background: #FFD700;
                        border-radius: 50%;
                        animation: bounce 1.4s ease-in-out infinite both;
                    "></div>
                </div>
                
                <!-- Progress Bar -->
                <div style="
                    width: 200px;
                    height: 6px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 3px;
                    margin: 30px auto 0;
                    overflow: hidden;
                ">
                    <div style="
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, #FFD700, #fff3ad, #FFD700);
                        border-radius: 3px;
                        animation: progress 2s ease-in-out infinite;
                        transform: translateX(-100%);
                    "></div>
                </div>
            </div>
        </div>
        
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes catSpin {
                0% { transform: rotate(0deg) scale(1); }
                25% { transform: rotate(90deg) scale(1.1); }
                50% { transform: rotate(180deg) scale(1); }
                75% { transform: rotate(270deg) scale(1.1); }
                100% { transform: rotate(360deg) scale(1); }
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.05); }
            }
            
            @keyframes bounce {
                0%, 80%, 100% { 
                    transform: translateY(0) scale(0.8); 
                    opacity: 0.5; 
                }
                40% { 
                    transform: translateY(-10px) scale(1.2); 
                    opacity: 1; 
                }
            }
            
            @keyframes progress {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(0%); }
                100% { transform: translateX(100%); }
            }
            
            /* Hide scrollbar during loading */
            body.loading {
                overflow: hidden;
            }
        </style>
    `;
    
    // Insert loader into page
    function showLoader() {
        document.body.insertAdjacentHTML('afterbegin', loaderHTML);
        document.body.classList.add('loading');
    }
    
    // Remove loader
    function hideLoader() {
        const loader = document.getElementById('universal-loader');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            document.body.classList.remove('loading');
            
            setTimeout(() => {
                loader.remove();
            }, 500);
        }
    }
    
    // Show loader immediately
    showLoader();
    
    // Hide loader when page is fully loaded
    if (document.readyState === 'loading') {
        window.addEventListener('load', function() {
            // Add a minimum loading time for better UX
            setTimeout(hideLoader, 800);
        });
    } else {
        // Page already loaded
        setTimeout(hideLoader, 500);
    }
    
    // Fallback: Hide loader after maximum time
    setTimeout(hideLoader, 5000);
    
    // Optional: Show loader for AJAX requests (if jQuery is available)
    if (typeof $ !== 'undefined') {
        $(document).ajaxStart(showLoader);
        $(document).ajaxStop(function() {
            setTimeout(hideLoader, 300);
        });
    }
    
    // Optional: Manual control functions (accessible globally)
    window.UniversalLoader = {
        show: showLoader,
        hide: hideLoader,
        
        // Custom loader with message
        showWithMessage: function(message) {
            showLoader();
            const loader = document.getElementById('universal-loader');
            if (loader) {
                const textElement = loader.querySelector('div div:nth-child(2)');
                if (textElement) {
                    textElement.textContent = message;
                }
            }
        }
    };
    
})();