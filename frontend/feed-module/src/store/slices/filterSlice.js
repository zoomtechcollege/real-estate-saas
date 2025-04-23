// feed-module/src/store/slices/filterSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchPropertiesFeed } from './feedSlice';

// מצב התחלתי - פילטרים בברירת מחדל
const initialState = {
    type: 'all', // 'all', 'sale', 'rent'
    propertyType: 'all', // 'all', 'apartment', 'house', 'land', 'commercial'
    priceRange: {
        min: '',
        max: ''
    },
    areaRange: {
        min: '',
        max: ''
    },
    rooms: {
        min: '',
        max: ''
    },
    location: {
        city: '',
        neighborhood: ''
    },
    features: {
        hasParking: false,
        hasElevator: false,
        hasAC: false,
        isRenovated: false,
        hasFurniture: false
    },
    sortBy: 'newest', // 'newest', 'price_low', 'price_high', 'area_high'
    isFiltersOpen: false, // האם פאנל הפילטרים פתוח
    appliedFilters: 0, // מספר הפילטרים שמופעלים כרגע
    recentSearches: [], // חיפושים אחרונים שנשמרו
    isLoading: false // האם הפילטרים בתהליך טעינה
};

const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        // עדכון סוג העסקה (מכירה/שכירות)
        setType: (state, action) => {
            state.type = action.payload;
            state.appliedFilters = calculateAppliedFilters(state);
        },

        // עדכון סוג הנכס
        setPropertyType: (state, action) => {
            state.propertyType = action.payload;
            state.appliedFilters = calculateAppliedFilters(state);
        },

        // עדכון טווח מחירים
        setPriceRange: (state, action) => {
            const { min, max } = action.payload;
            state.priceRange = { min, max };
            state.appliedFilters = calculateAppliedFilters(state);
        },

        // עדכון טווח שטח
        setAreaRange: (state, action) => {
            const { min, max } = action.payload;
            state.areaRange = { min, max };
            state.appliedFilters = calculateAppliedFilters(state);
        },

        // עדכון טווח חדרים
        setRooms: (state, action) => {
            const { min, max } = action.payload;
            state.rooms = { min, max };
            state.appliedFilters = calculateAppliedFilters(state);
        },

        // עדכון מיקום
        setLocation: (state, action) => {
            const { city, neighborhood } = action.payload;
            state.location = { city, neighborhood };
            state.appliedFilters = calculateAppliedFilters(state);
        },

        // החלפת מצב תכונה
        toggleFeature: (state, action) => {
            const feature = action.payload;
            state.features[feature] = !state.features[feature];
            state.appliedFilters = calculateAppliedFilters(state);
        },

        // שינוי אופן המיון
        setSortBy: (state, action) => {
            state.sortBy = action.payload;
        },

        // פתיחה/סגירה של פאנל הפילטרים
        toggleFiltersPanel: (state) => {
            state.isFiltersOpen = !state.isFiltersOpen;
        },

        // איפוס כל הפילטרים לברירת מחדל
        resetFilters: (state) => {
            return {
                ...initialState,
                recentSearches: state.recentSearches,
                sortBy: state.sortBy // שומר על אופן המיון הנוכחי
            };
        },

        // שמירת חיפוש נוכחי להיסטוריה
        saveCurrentSearch: (state) => {
            // בודקים שיש לפחות פילטר אחד פעיל
            if (state.appliedFilters > 0) {
                const currentSearch = {
                    id: Date.now(),
                    type: state.type,
                    propertyType: state.propertyType,
                    priceRange: { ...state.priceRange },
                    location: { ...state.location },
                    appliedFilters: state.appliedFilters,
                    timestamp: new Date().toISOString()
                };

                // מוסיפים את החיפוש להיסטוריה ושומרים מקסימום 5 חיפושים
                state.recentSearches = [
                    currentSearch,
                    ...state.recentSearches.filter(search => search.id !== currentSearch.id)
                ].slice(0, 5);
            }
        },

        // טעינת חיפוש שמור
        loadSavedSearch: (state, action) => {
            const savedSearch = action.payload;

            // מעתיקים רק את השדות הרלוונטיים
            state.type = savedSearch.type;
            state.propertyType = savedSearch.propertyType;
            state.priceRange = { ...savedSearch.priceRange };
            state.location = { ...savedSearch.location };

            // מחשבים מחדש את מספר הפילטרים המופעלים
            state.appliedFilters = calculateAppliedFilters(state);
        },

        // מחיקת חיפוש שמור
        removeSavedSearch: (state, action) => {
            const searchId = action.payload;
            state.recentSearches = state.recentSearches.filter(search => search.id !== searchId);
        },

        // עדכון מספר פילטרים פעילים
        updateAppliedFiltersCount: (state) => {
            state.appliedFilters = calculateAppliedFilters(state);
        },

        // הגדרת מצב טעינה
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // כאשר מתחילה טעינה של הפיד, מסמנים שהפילטרים בטעינה
            .addCase(fetchPropertiesFeed.pending, (state) => {
                state.isLoading = true;
            })
            // כאשר הטעינה מסתיימת, מסמנים שהפילטרים סיימו טעינה
            .addCase(fetchPropertiesFeed.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(fetchPropertiesFeed.rejected, (state) => {
                state.isLoading = false;
            });
    }
});

// פונקציית עזר לחישוב מספר הפילטרים הפעילים
const calculateAppliedFilters = (state) => {
    let count = 0;

    // סופרים את כל הפילטרים הפעילים
    if (state.type !== 'all') count++;
    if (state.propertyType !== 'all') count++;
    if (state.priceRange.min || state.priceRange.max) count++;
    if (state.areaRange.min || state.areaRange.max) count++;
    if (state.rooms.min || state.rooms.max) count++;
    if (state.location.city) count++;
    if (state.location.neighborhood) count++;

    // סופרים תכונות פעילות
    Object.values(state.features).forEach(value => {
        if (value) count++;
    });

    return count;
};

export const {
    setType,
    setPropertyType,
    setPriceRange,
    setAreaRange,
    setRooms,
    setLocation,
    toggleFeature,
    setSortBy,
    toggleFiltersPanel,
    resetFilters,
    saveCurrentSearch,
    loadSavedSearch,
    removeSavedSearch,
    updateAppliedFiltersCount,
    setLoading
} = filterSlice.actions;

export default filterSlice.reducer;

// Selectors
export const selectAllFilters = (state) => state.filters;
export const selectFilterType = (state) => state.filters.type;
export const selectPropertyType = (state) => state.filters.propertyType;
export const selectPriceRange = (state) => state.filters.priceRange;
export const selectAreaRange = (state) => state.filters.areaRange;
export const selectRooms = (state) => state.filters.rooms;
export const selectLocation = (state) => state.filters.location;
export const selectFeatures = (state) => state.filters.features;
export const selectSortBy = (state) => state.filters.sortBy;
export const selectIsFiltersOpen = (state) => state.filters.isFiltersOpen;
export const selectAppliedFiltersCount = (state) => state.filters.appliedFilters;
export const selectRecentSearches = (state) => state.filters.recentSearches;
export const selectIsLoading = (state) => state.filters.isLoading;

// סלקטור שמחזיר את כל הפילטרים כאובייקט מוכן לשליחה לשרת
export const selectApiFilters = (state) => {
    const filters = state.filters;
    const apiFilters = {};

    // מוסיפים רק פילטרים שיש להם ערך
    if (filters.type !== 'all') apiFilters.type = filters.type;
    if (filters.propertyType !== 'all') apiFilters.propertyType = filters.propertyType;

    if (filters.priceRange.min) apiFilters.minPrice = filters.priceRange.min;
    if (filters.priceRange.max) apiFilters.maxPrice = filters.priceRange.max;

    if (filters.areaRange.min) apiFilters.minArea = filters.areaRange.min;
    if (filters.areaRange.max) apiFilters.maxArea = filters.areaRange.max;

    if (filters.rooms.min) apiFilters.minRooms = filters.rooms.min;
    if (filters.rooms.max) apiFilters.maxRooms = filters.rooms.max;

    if (filters.location.city) apiFilters.city = filters.location.city;
    if (filters.location.neighborhood) apiFilters.neighborhood = filters.location.neighborhood;

    // מוסיפים רק תכונות פעילות
    const activeFeatures = {};
    let hasActiveFeatures = false;

    Object.entries(filters.features).forEach(([key, value]) => {
        if (value) {
            activeFeatures[key] = true;
            hasActiveFeatures = true;
        }
    });

    if (hasActiveFeatures) {
        apiFilters.features = activeFeatures;
    }

    // מוסיפים גם את אופן המיון
    apiFilters.sort = filters.sortBy;

    return apiFilters;
};