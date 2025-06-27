// Landing Page Builder JavaScript
class LandingPageBuilder {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.dropZone = document.querySelector('.drop-zone');
        this.propertiesPanel = document.getElementById('propertiesContent');
        this.selectedElement = null;
        this.elements = [];
        this.elementCounter = 0;
        
        this.init();
    }

    init() {
        this.setupDragAndDrop();
        this.setupEventListeners();
        this.setupElementTemplates();
    }

    setupDragAndDrop() {
        console.log('Setting up drag and drop...');
        
        // Setup draggable elements
        const elementItems = document.querySelectorAll('.element-item');
        console.log('Found element items:', elementItems.length);
        
        elementItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                console.log('Drag started for element:', item.dataset.element);
                e.dataTransfer.setData('text/plain', item.dataset.element);
                e.dataTransfer.effectAllowed = 'copy';
            });
        });

        // Setup drop zone
        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
            this.dropZone.classList.add('drag-over');
        });

        this.canvas.addEventListener('dragleave', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('drag-over');
        });

        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('drag-over');
            
            const elementType = e.dataTransfer.getData('text/plain');
            console.log('Drop event - element type:', elementType);
            
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            console.log('Drop position:', x, y);
            this.createElement(elementType, x, y);
        });
        
        console.log('Drag and drop setup complete');
    }

    setupEventListeners() {
        // Builder controls
        document.getElementById('previewBtn').addEventListener('click', () => this.showPreview());
        document.getElementById('saveBtn').addEventListener('click', () => this.savePage());
        document.getElementById('exportBtn').addEventListener('click', () => this.showExportModal());
        document.getElementById('publishBtn').addEventListener('click', () => this.publishPage());

        // View controls
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.changeView(e.target.dataset.view);
            });
        });

        // Modal controls
        document.getElementById('closePreview').addEventListener('click', () => this.hidePreview());
        document.getElementById('closeExport').addEventListener('click', () => this.hideExportModal());
        document.getElementById('downloadHtml').addEventListener('click', () => this.downloadHtml());
        document.getElementById('publishLive').addEventListener('click', () => this.publishLive());

        // Canvas click to deselect
        this.canvas.addEventListener('click', (e) => {
            if (e.target === this.canvas || e.target === this.dropZone) {
                this.deselectElement();
            }
        });
    }

    setupElementTemplates() {
        this.elementTemplates = {
            heading: {
                html: '<h2 class="builder-element" contenteditable="true">Your Heading Here</h2>',
                defaultStyles: {
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#333',
                    textAlign: 'center',
                    margin: '20px 0'
                }
            },
            text: {
                html: '<p class="builder-element" contenteditable="true">Your text content goes here. Click to edit this paragraph and add your message.</p>',
                defaultStyles: {
                    fontSize: '1rem',
                    color: '#666',
                    lineHeight: '1.6',
                    margin: '15px 0'
                }
            },
            button: {
                html: '<button class="builder-element btn btn-primary">Click Here</button>',
                defaultStyles: {
                    padding: '12px 24px',
                    fontSize: '1rem',
                    backgroundColor: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }
            },
            image: {
                html: '<img class="builder-element" src="https://via.placeholder.com/400x300" alt="Placeholder Image">',
                defaultStyles: {
                    maxWidth: '100%',
                    height: 'auto',
                    display: 'block',
                    margin: '20px auto'
                }
            },
            form: {
                html: `
                    <form class="builder-element contact-form">
                        <input type="text" placeholder="Your Name" required>
                        <input type="email" placeholder="Your Email" required>
                        <textarea placeholder="Your Message" rows="4" required></textarea>
                        <button type="submit">Send Message</button>
                    </form>
                `,
                defaultStyles: {
                    maxWidth: '500px',
                    margin: '20px auto',
                    padding: '20px'
                }
            },
            input: {
                html: '<input class="builder-element" type="text" placeholder="Enter text here">',
                defaultStyles: {
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '1rem'
                }
            },
            textarea: {
                html: '<textarea class="builder-element" placeholder="Enter your message here" rows="4"></textarea>',
                defaultStyles: {
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '1rem',
                    resize: 'vertical'
                }
            },
            container: {
                html: '<div class="builder-element container-element"></div>',
                defaultStyles: {
                    minHeight: '100px',
                    border: '2px dashed #ddd',
                    padding: '20px',
                    margin: '10px 0'
                }
            },
            divider: {
                html: '<hr class="builder-element">',
                defaultStyles: {
                    border: 'none',
                    height: '2px',
                    backgroundColor: '#ddd',
                    margin: '30px 0'
                }
            },
            spacer: {
                html: '<div class="builder-element spacer-element"></div>',
                defaultStyles: {
                    height: '50px',
                    width: '100%'
                }
            },
            video: {
                html: '<div class="builder-element video-container"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe></div>',
                defaultStyles: {
                    width: '100%',
                    maxWidth: '600px',
                    margin: '20px auto'
                }
            },
            testimonial: {
                html: `
                    <div class="builder-element testimonial">
                        <div class="quote">"This is an amazing product that has transformed our business!"</div>
                        <div class="author">- John Doe, CEO</div>
                    </div>
                `,
                defaultStyles: {
                    textAlign: 'center',
                    padding: '30px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '10px',
                    margin: '20px 0'
                }
            },
            counter: {
                html: '<div class="builder-element counter"><span class="count">0</span><div class="label">Happy Customers</div></div>',
                defaultStyles: {
                    textAlign: 'center',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#3498db'
                }
            }
        };
    }

    createElement(type, x, y) {
        console.log('Creating element:', type, 'at position:', x, y);
        const template = this.elementTemplates[type];
        if (!template) {
            console.error('Template not found for element type:', type);
            return;
        }

        this.elementCounter++;
        const elementId = `element-${this.elementCounter}`;
        
        // Create element wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'element-wrapper';
        wrapper.id = elementId;
        wrapper.style.position = 'absolute';
        wrapper.style.left = `${x}px`;
        wrapper.style.top = `${y}px`;
        wrapper.style.minWidth = '200px';
        wrapper.style.zIndex = '10';

        // Create element content
        wrapper.innerHTML = template.html;
        const element = wrapper.querySelector('.builder-element');
        
        if (!element) {
            console.error('Builder element not found in template for:', type);
            return;
        }
        
        // Apply default styles
        Object.assign(element.style, template.defaultStyles);

        // Add element controls
        const controls = document.createElement('div');
        controls.className = 'element-controls';
        controls.innerHTML = `
            <button class="control-btn move-btn" title="Move"><i class="fas fa-arrows-alt"></i></button>
            <button class="control-btn delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
        `;
        wrapper.appendChild(controls);

        // Add event listeners
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectElement(wrapper);
        });

        controls.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteElement(wrapper);
        });

        // Add to canvas
        this.canvas.appendChild(wrapper);
        this.elements.push({
            id: elementId,
            type: type,
            element: wrapper,
            styles: { ...template.defaultStyles }
        });

        console.log('Element created successfully:', elementId);
        
        // Select the new element
        this.selectElement(wrapper);
    }

    selectElement(wrapper) {
        // Deselect previous element
        this.deselectElement();
        
        // Select new element
        this.selectedElement = wrapper;
        wrapper.classList.add('selected');
        
        // Show properties panel
        this.showProperties(wrapper);
    }

    deselectElement() {
        if (this.selectedElement) {
            this.selectedElement.classList.remove('selected');
            this.selectedElement = null;
        }
        this.hideProperties();
    }

    deleteElement(wrapper) {
        const index = this.elements.findIndex(el => el.element === wrapper);
        if (index > -1) {
            this.elements.splice(index, 1);
        }
        wrapper.remove();
        this.deselectElement();
    }

    showProperties(wrapper) {
        const element = wrapper.querySelector('.builder-element');
        const elementData = this.elements.find(el => el.element === wrapper);
        
        this.propertiesPanel.innerHTML = `
            <div class="property-group">
                <h4>Text Properties</h4>
                <div class="property-item">
                    <label>Text Color:</label>
                    <input type="color" value="${element.style.color || '#333'}" onchange="builder.updateProperty('color', this.value)">
                </div>
                <div class="property-item">
                    <label>Font Size:</label>
                    <input type="range" min="12" max="72" value="${parseInt(element.style.fontSize) || 16}" onchange="builder.updateProperty('fontSize', this.value + 'px')">
                    <span>${parseInt(element.style.fontSize) || 16}px</span>
                </div>
                <div class="property-item">
                    <label>Font Weight:</label>
                    <select onchange="builder.updateProperty('fontWeight', this.value)">
                        <option value="normal" ${element.style.fontWeight === 'normal' ? 'selected' : ''}>Normal</option>
                        <option value="bold" ${element.style.fontWeight === 'bold' ? 'selected' : ''}>Bold</option>
                    </select>
                </div>
            </div>
            <div class="property-group">
                <h4>Layout Properties</h4>
                <div class="property-item">
                    <label>Text Align:</label>
                    <select onchange="builder.updateProperty('textAlign', this.value)">
                        <option value="left" ${element.style.textAlign === 'left' ? 'selected' : ''}>Left</option>
                        <option value="center" ${element.style.textAlign === 'center' ? 'selected' : ''}>Center</option>
                        <option value="right" ${element.style.textAlign === 'right' ? 'selected' : ''}>Right</option>
                    </select>
                </div>
                <div class="property-item">
                    <label>Margin:</label>
                    <input type="number" value="${parseInt(element.style.margin) || 0}" onchange="builder.updateProperty('margin', this.value + 'px')">
                </div>
            </div>
            <div class="property-group">
                <h4>Background</h4>
                <div class="property-item">
                    <label>Background Color:</label>
                    <input type="color" value="${element.style.backgroundColor || '#ffffff'}" onchange="builder.updateProperty('backgroundColor', this.value)">
                </div>
            </div>
        `;
    }

    hideProperties() {
        this.propertiesPanel.innerHTML = `
            <div class="no-selection">
                <i class="fas fa-hand-pointer"></i>
                <p>Select an element to edit its properties</p>
            </div>
        `;
    }

    updateProperty(property, value) {
        if (!this.selectedElement) return;
        
        const element = this.selectedElement.querySelector('.builder-element');
        element.style[property] = value;
        
        // Update element data
        const elementData = this.elements.find(el => el.element === this.selectedElement);
        if (elementData) {
            elementData.styles[property] = value;
        }
    }

    showPreview() {
        const modal = document.getElementById('previewModal');
        const container = document.getElementById('previewContainer');
        
        // Clone canvas content
        const clone = this.canvas.cloneNode(true);
        
        // Remove builder-specific classes and controls
        clone.querySelectorAll('.element-wrapper').forEach(wrapper => {
            const element = wrapper.querySelector('.builder-element');
            wrapper.replaceWith(element);
        });
        
        container.innerHTML = '';
        container.appendChild(clone);
        modal.style.display = 'flex';
    }

    hidePreview() {
        document.getElementById('previewModal').style.display = 'none';
    }

    showExportModal() {
        document.getElementById('exportModal').style.display = 'flex';
    }

    hideExportModal() {
        document.getElementById('exportModal').style.display = 'none';
    }

    savePage() {
        const pageData = {
            elements: this.elements.map(el => ({
                id: el.id,
                type: el.type,
                styles: el.styles,
                content: el.element.querySelector('.builder-element').innerHTML
            })),
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('landingPageData', JSON.stringify(pageData));
        
        // Show success message
        this.showNotification('Page saved successfully!', 'success');
    }

    downloadHtml() {
        const html = this.generateHtml();
        const css = this.generateCss();
        
        // Create zip file
        const zip = new JSZip();
        zip.file('index.html', html);
        zip.file('styles.css', css);
        
        zip.generateAsync({type: 'blob'}).then(content => {
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'landing-page.zip';
            a.click();
            URL.revokeObjectURL(url);
        });
        
        this.hideExportModal();
        this.showNotification('Files downloaded successfully!', 'success');
    }

    publishLive() {
        // This would typically connect to a backend service
        this.showNotification('Publishing to live server...', 'info');
        
        setTimeout(() => {
            this.hideExportModal();
            this.showNotification('Page published successfully! Live URL: https://yourpage.webcraftstudio.com', 'success');
        }, 2000);
    }

    generateHtml() {
        let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
`;
        
        this.elements.forEach(el => {
            const element = el.element.querySelector('.builder-element');
            html += element.outerHTML;
        });
        
        html += `
</body>
</html>`;
        
        return html;
    }

    generateCss() {
        let css = `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.btn {
    display: inline-block;
    padding: 12px 24px;
    background-color: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    font-size: 1rem;
}

.btn:hover {
    background-color: #2980b9;
}

.contact-form {
    max-width: 500px;
    margin: 20px auto;
    padding: 20px;
}

.contact-form input,
.contact-form textarea {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
}

.testimonial {
    text-align: center;
    padding: 30px;
    background-color: #f8f9fa;
    border-radius: 10px;
    margin: 20px 0;
}

.testimonial .quote {
    font-style: italic;
    font-size: 1.2rem;
    margin-bottom: 10px;
}

.testimonial .author {
    font-weight: bold;
    color: #666;
}

.counter {
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
    color: #3498db;
}

.counter .label {
    font-size: 1rem;
    color: #666;
    margin-top: 5px;
}

.video-container {
    position: relative;
    width: 100%;
    max-width: 600px;
    margin: 20px auto;
}

.video-container iframe {
    width: 100%;
    height: 315px;
}

@media (max-width: 768px) {
    .container {
        padding: 0 15px;
    }
    
    .contact-form {
        margin: 10px;
    }
}
`;
        
        return css;
    }

    changeView(view) {
        const canvas = document.querySelector('.canvas-container');
        canvas.className = `canvas-container view-${view}`;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize builder when DOM is loaded
let builder;
document.addEventListener('DOMContentLoaded', () => {
    try {
        builder = new LandingPageBuilder();
        // Make builder globally accessible for property updates
        window.builder = builder;
        console.log('Landing Page Builder initialized successfully');
    } catch (error) {
        console.error('Error initializing Landing Page Builder:', error);
    }
}); 