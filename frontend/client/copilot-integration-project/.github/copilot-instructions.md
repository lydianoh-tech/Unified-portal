# Contents of the file: /copilot-integration-project/copilot-integration-project/.github/copilot-instructions.md

# Copilot Integration Instructions

## Overview
This document provides instructions for AI coding agents on how to effectively interact with the copilot-integration-project codebase. It outlines the key components, conventions, and best practices to ensure seamless integration with Copilot.

## Project Structure
- **src/integrations/copilot.ts**: Contains the `CopilotIntegration` class responsible for managing the integration logic with Copilot.
- **src/services/customization-service.ts**: Houses the `CustomizationService` class that facilitates the creation and updating of chat customization files.
- **src/types/index.ts**: Defines the `Customization` and `IntegrationConfig` interfaces for structuring customization data and integration configurations.

## Key Instructions
1. **Initialization**: When starting the integration, ensure that the `CopilotIntegration` class is properly instantiated and configured.
2. **Customization Management**: Utilize the `CustomizationService` to create or update customization files as needed. This service is crucial for maintaining effective communication between AI agents and the codebase.
3. **Type Definitions**: Refer to the interfaces defined in `src/types/index.ts` to ensure that all customization data and integration configurations adhere to the expected structure.

## Best Practices
- Always keep the customization files up to date to reflect any changes in the project structure or conventions.
- Use the provided services and types to maintain consistency and clarity in the codebase.
- Document any new features or changes in the README.md to keep all team members informed.

## Conclusion
Following these instructions will help AI coding agents navigate the copilot-integration-project efficiently, ensuring productive interactions with the codebase. For any questions or clarifications, refer to the project documentation or reach out to the team.