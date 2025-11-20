# Images Directory

Place all your website images in this directory.

## Required Images

### Hero Section Slideshow (3 images):

1. **hero-1.jpg** - First background image
2. **hero-2.jpg** - Second background image
3. **hero-3.jpg** - Third background image

### "How It Works" Section (1 image):

4. **how-it-works.jpg** - Real estate agent showing tablet to couple (from screenshot 2)

### "Sales Value Determination" Section (1 image):

5. **sales-value.jpg** - Real estate agent presenting to couple in property (from screenshot 3)

### "Mortgage Refinancing" Section (1 image):

6. **mortgage-refinance.jpg** - Mortgage refinance application on laptop (from screenshot 4)

### "How to Sell Your House for More" Section (1 image):

7. **sell-for-more.jpg** - Happy couple excited looking at phone (from screenshot 5, left image)

### "How to Interview an Agent" Section (1 image):

8. **interview-agent.jpg** - Agent meeting with couple at table (from screenshot 5, right image)

### Articles/Blog Section (4 images):

9. **article-1.jpg** - House price report image (documents/clipboard with house)
10. **article-2.jpg** - Open home preparation (agent showing property)
11. **article-3.jpg** - Private sale guide (business meeting)
12. **article-4.jpg** - Home staging guide (family with "For Sale" sign)

### About Us Section (1 image):

13. **about-team.jpg** - Professional team photo of real estate agents (from screenshot)

**Total Images Needed: 13**

## Image Requirements

- **Format**: JPG, PNG, or WebP
- **Recommended Resolution**: 1920x1080 (Full HD) or higher
- **Aspect Ratio**: 16:9 (landscape)
- **File Size**: Keep under 500KB each for optimal loading
- **Subject**: Should work well with white text overlay

## Image Optimization Tips

1. **Use image compression tools**:
   - [TinyPNG](https://tinypng.com/)
   - [Squoosh](https://squoosh.app/)
   - ImageOptim (Mac)

2. **Ensure good contrast**: The images will have a dark overlay (40% black) for text readability

3. **Test on mobile**: Make sure important elements are visible on smaller screens

## Using Your Own Images

If you're using the image from your screenshot:
- Save it as `hero-1.jpg`
- Find 2 more similar property/home images for variety
- Make sure they all have similar lighting and style for consistency

## Default Behavior

If images are not found, the component will show a fallback gradient background. Update the `heroImages` array in `components/HeroSection.tsx` if you want to use different image names or quantities.
