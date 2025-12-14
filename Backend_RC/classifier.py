from torchvision import transforms, models
import torch
import torch.nn as nn
import cv2
import matplotlib.pyplot as plt
from PIL import Image


class_names = [
    'butterfly',
    'cat',
    'cow',
    'chicken',
    'dog',
    'elephant',
    'horse',
    'sheep',
    'spider',
    'squirrel'
]

val_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

class AnimalClassifier:
    def __init__(self, model_path='model/best_animals_model.pth'):
        """Initialize classifier with trained model"""
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

        # Load model
        self.model = models.efficientnet_b0(pretrained=False)
        num_features = self.model.classifier[1].in_features
        self.model.classifier = nn.Sequential(
            nn.Dropout(p=0.2, inplace=True),
            nn.Linear(num_features, len(class_names))
        )

        # Load weights
        checkpoint = torch.load(model_path, map_location=self.device)
        self.model.load_state_dict(checkpoint['model_state_dict'])
        self.model = self.model.to(self.device)
        self.model.eval()

        self.class_names = class_names
        self.transform = val_transform

        print(f"✅ Classifier loaded from {model_path}")
        print(f"Test accuracy: {checkpoint.get('val_acc', 'N/A')}%")

    def predict(self, image_input, top_k=3):
        if isinstance(image_input, str):
            image = cv2.imread(image_input)
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            pil_image = Image.fromarray(image)

        elif isinstance(image_input, Image.Image):
            pil_image = image_input

        else:
            pil_image = Image.fromarray(image_input)

        image_tensor = self.transform(pil_image).unsqueeze(0).to(self.device)

        with torch.no_grad():
            outputs = self.model(image_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            top_probs, top_indices = torch.topk(probabilities, top_k)

        results = []
        for i in range(top_k):
            idx = top_indices[0][i].item()
            results.append({
                "class": self.class_names[idx],
                "confidence": round(top_probs[0][i].item() * 100, 2),
                "class_idx": idx
            })

        return results


    def predict_and_visualize(self, image_path):
        """Predict and visualize results"""
        # Make prediction
        results = self.predict(image_path, top_k=5)

        # Load and display image
        if isinstance(image_path, str):
            image = cv2.imread(image_path)
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        else:
            image = image_path

        fig, axes = plt.subplots(1, 2, figsize=(12, 5))

        # Show image
        axes[0].imshow(image)
        axes[0].set_title(f"Input Image\nPredicted: {results[0]['class']} ({results[0]['confidence']:.1f}%)")
        axes[0].axis('off')

        # Show predictions bar chart
        classes = [r['class'] for r in results]
        confidences = [r['confidence'] for r in results]

        bars = axes[1].barh(range(len(classes)), confidences, color='skyblue')
        axes[1].set_yticks(range(len(classes)))
        axes[1].set_yticklabels(classes)
        axes[1].set_xlabel('Confidence (%)')
        axes[1].set_title('Top 5 Predictions')
        axes[1].set_xlim([0, 100])

        # Add confidence values
        for bar, conf in zip(bars, confidences):
            width = bar.get_width()
            axes[1].text(width + 1, bar.get_y() + bar.get_height()/2,
                        f'{conf:.1f}%', va='center')

        plt.tight_layout()
        plt.show()

        return results

