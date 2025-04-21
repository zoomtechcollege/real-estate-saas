// properties-module/src/store/slices/propertyFormSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { createProperty, updateProperty } from './propertySlice';

// מצב התחלתי - טופס ריק
const initialState = {
    formData: {
        title: '',
        description: '',
        type: 'sale', // 'sale' או 'rent'
        propertyType: 'apartment', // 'apartment', 'house', 'land', 'commercial'
        price: '',
        area: '',
        rooms: '',
        bathrooms: '',
        location: {
            city: '',
            street: '',
            houseNumber: '',
            neighborhood: ''
        },
        features: {
            hasParking: false,
            hasElevator: false,
            hasAC: false,
            hasSafe: false,
            isRenovated: false,
            hasFurniture: false,
            hasStorage: false,
            hasAccessibility: false
        },
        images: [],
        contactInfo: {
            showEmail: true,
            showPhone: true
        }
    },
    currentStep: 1,
    totalSteps: 4,
    isEditing: false,
    propertyId: null,
    errors: {},
    isDirty: false
};

const propertyFormSlice = createSlice({
    name: 'propertyForm',
    initialState,
    reducers: {
        // עדכון שדה בודד בטופס
        updateField: (state, action) => {
            const { field, value } = action.payload;
            // תמיכה בשדות מקוננים כמו location.city
            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                state.formData[parent][child] = value;
            } else {
                state.formData[field] = value;
            }
            state.isDirty = true;

            // ניקוי שגיאה אם קיימת עבור השדה הזה
            if (state.errors[field]) {
                delete state.errors[field];
            }
        },

        // עדכון מספר תכונות בבת אחת
        updateMultipleFields: (state, action) => {
            const fields = action.payload;
            Object.keys(fields).forEach(field => {
                if (field.includes('.')) {
                    const [parent, child] = field.split('.');
                    state.formData[parent][child] = fields[field];
                } else {
                    state.formData[field] = fields[field];
                }
            });
            state.isDirty = true;
        },

        // עדכון תכונה בודדת (פיצ'ר)
        toggleFeature: (state, action) => {
            const feature = action.payload;
            state.formData.features[feature] = !state.formData.features[feature];
            state.isDirty = true;
        },

        // העלאת תמונה חדשה (או הוספת URL של תמונה)
        addImage: (state, action) => {
            state.formData.images.push(action.payload);
            state.isDirty = true;
        },

        // הסרת תמונה לפי אינדקס
        removeImage: (state, action) => {
            const index = action.payload;
            state.formData.images.splice(index, 1);
            state.isDirty = true;
        },

        // מעבר לשלב הבא בטופס הרב-שלבי
        nextStep: (state) => {
            if (state.currentStep < state.totalSteps) {
                state.currentStep += 1;
            }
        },

        // חזרה לשלב הקודם בטופס הרב-שלבי
        prevStep: (state) => {
            if (state.currentStep > 1) {
                state.currentStep -= 1;
            }
        },

        // מעבר ישיר לשלב מסוים
        goToStep: (state, action) => {
            const step = action.payload;
            if (step >= 1 && step <= state.totalSteps) {
                state.currentStep = step;
            }
        },

        // הגדרת שגיאות אימות בטופס
        setErrors: (state, action) => {
            state.errors = action.payload;
        },

        // ניקוי שגיאות
        clearErrors: (state) => {
            state.errors = {};
        },

        // איפוס הטופס למצב התחלתי
        resetForm: () => initialState,

        // טעינת נתוני נכס קיים לעריכה
        loadPropertyForEdit: (state, action) => {
            const property = action.payload;

            // העתקת כל המידע מהנכס לטופס
            state.formData = {
                title: property.title || '',
                description: property.description || '',
                type: property.type || 'sale',
                propertyType: property.propertyType || 'apartment',
                price: property.price || '',
                area: property.area || '',
                rooms: property.rooms || '',
                bathrooms: property.bathrooms || '',
                location: {
                    city: property.location?.city || '',
                    street: property.location?.street || '',
                    houseNumber: property.location?.houseNumber || '',
                    neighborhood: property.location?.neighborhood || ''
                },
                features: {
                    hasParking: property.features?.hasParking || false,
                    hasElevator: property.features?.hasElevator || false,
                    hasAC: property.features?.hasAC || false,
                    hasSafe: property.features?.hasSafe || false,
                    isRenovated: property.features?.isRenovated || false,
                    hasFurniture: property.features?.hasFurniture || false,
                    hasStorage: property.features?.hasStorage || false,
                    hasAccessibility: property.features?.hasAccessibility || false
                },
                images: property.images || [],
                contactInfo: {
                    showEmail: property.contactInfo?.showEmail ?? true,
                    showPhone: property.contactInfo?.showPhone ?? true
                }
            };

            state.isEditing = true;
            state.propertyId = property._id;
            state.isDirty = false;
            state.currentStep = 1;
            state.errors = {};
        }
    },
    extraReducers: (builder) => {
        builder
            // אחרי יצירת נכס חדש בהצלחה - איפוס הטופס
            .addCase(createProperty.fulfilled, () => initialState)

            // אחרי עדכון נכס בהצלחה - איפוס דגל השינויים
            .addCase(updateProperty.fulfilled, (state) => {
                state.isDirty = false;
            });
    }
});

export const {
    updateField,
    updateMultipleFields,
    toggleFeature,
    addImage,
    removeImage,
    nextStep,
    prevStep,
    goToStep,
    setErrors,
    clearErrors,
    resetForm,
    loadPropertyForEdit
} = propertyFormSlice.actions;

export default propertyFormSlice.reducer;

// Selectors
export const selectFormData = (state) => state.propertyForm.formData;
export const selectCurrentStep = (state) => state.propertyForm.currentStep;
export const selectTotalSteps = (state) => state.propertyForm.totalSteps;
export const selectIsEditing = (state) => state.propertyForm.isEditing;
export const selectPropertyId = (state) => state.propertyForm.propertyId;
export const selectFormErrors = (state) => state.propertyForm.errors;
export const selectIsDirty = (state) => state.propertyForm.isDirty;
export const selectFormField = (field) => (state) => {
    if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return state.propertyForm.formData[parent][child];
    }
    return state.propertyForm.formData[field];
};
export const selectFieldError = (field) => (state) => state.propertyForm.errors[field];
export const selectFeature = (feature) => (state) => state.propertyForm.formData.features[feature];