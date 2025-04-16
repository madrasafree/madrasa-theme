
# Madrasa's Open edX Theme

This repository contains a custom theme for Open edX platforms deployed with Tutor. This theme provides customization for the legacy LMS interface only (not MFE).

## About Open edX Theming

This theme applies to the legacy LMS interface of Open edX and not the Micro Frontend (MFE) architecture used in newer versions. MFEs have a separate theming process.

## Installation with Tutor

To use this theme with your Tutor-managed Open edX instance:

1. Clone this repository to your Tutor environment's themes directory:

   ```bash
   git clone https://github.com/your-username/openedx-theme.git \
     "$(tutor config printroot)/env/build/openedx/themes/openedx-theme"
   ```

2. Rebuild the OpenedX Docker image to include your theme:

   ```bash
   tutor images build openedx
   ```

3. Enable your theme with the settheme command:

   ```bash
   tutor local do settheme openedx-theme
   ```

4. Restart your Tutor services for the changes to take effect.

## Theme Structure

Your theme should follow this structure:

```
openedx/themes/
    openedx-theme/
        cms/
            static/
            templates/
        lms/
            static/
            templates/
```

## Development

For more information about theming in Tutor, please refer to the [official Tutor documentation on theming](https://docs.tutor.edly.io/tutorials/theming.html).
