# Contributing to Video Marketing Prompts

First off, thank you for considering contributing to Video Marketing Prompts! It's people like you that make this project such a great tool for the video marketing community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Commit Message Format](#commit-message-format)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Guidelines](#documentation-guidelines)
- [Issue Guidelines](#issue-guidelines)
- [Community](#community)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Examples of behavior that contributes to a positive environment:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Examples of unacceptable behavior:**
- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate in a professional setting

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 22.13.0 or higher
- **pnpm** package manager (v8.0.0+)
- **Git** for version control
- **MySQL/TiDB** database (or SQLite for development)
- **GitHub account** for contributing

### Fork and Clone

1. **Fork the repository** on GitHub:
   ```bash
   # Visit https://github.com/Tom198324/video-marketing-prompts
   # Click "Fork" button in the top-right corner
   ```

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/video-marketing-prompts.git
   cd video-marketing-prompts
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/Tom198324/video-marketing-prompts.git
   ```

### Setup Development Environment

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and API keys
   ```

3. **Push database schema**:
   ```bash
   pnpm db:push
   ```

4. **Start development server**:
   ```bash
   pnpm dev
   ```

5. **Run tests** to ensure everything works:
   ```bash
   pnpm test
   ```

---

## 🔄 Development Workflow

### 1. Create a Feature Branch

Always create a new branch for your work:

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/amazing-feature

# Or for bug fixes
git checkout -b fix/bug-description

# Or for documentation
git checkout -b docs/documentation-improvement
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the [Code Style Guidelines](#code-style-guidelines)
- Add unit tests for new features
- Update documentation as needed
- Keep commits atomic and focused

### 3. Test Your Changes

```bash
# Run all tests
pnpm test

# Run type checking
pnpm typecheck

# Run linter
pnpm lint

# Run formatter check
pnpm format:check
```

### 4. Commit Your Changes

Follow the [Commit Message Format](#commit-message-format):

```bash
git add .
git commit -m "feat(customizer): Add tone variation support"
```

### 5. Push to Your Fork

```bash
git push origin feature/amazing-feature
```

### 6. Open a Pull Request

- Go to your fork on GitHub
- Click "Compare & pull request"
- Fill out the PR template
- Link related issues
- Wait for review

---

## 🎨 Code Style Guidelines

### TypeScript

#### General Rules

- **Use TypeScript strict mode** - No `any` types unless absolutely necessary
- **Explicit return types** for functions
- **Interface over type** for object shapes
- **Descriptive variable names** - No single-letter variables except in loops

**Good:**
```typescript
interface UserPrompt {
  id: number;
  title: string;
  promptJson: string;
  tags: string[];
}

function getUserPrompts(userId: string): Promise<UserPrompt[]> {
  return db.query.userPrompts.findMany({
    where: eq(userPrompts.userId, userId),
  });
}
```

**Bad:**
```typescript
function getPrompts(u: any): any {
  return db.query.userPrompts.findMany({
    where: eq(userPrompts.userId, u),
  });
}
```

#### Naming Conventions

- **PascalCase** for components, interfaces, types, classes
- **camelCase** for variables, functions, methods
- **UPPER_SNAKE_CASE** for constants
- **kebab-case** for file names

```typescript
// Components
export default function CustomizerPage() { }

// Interfaces
interface PromptData { }

// Variables and functions
const userName = "John";
function calculateScore() { }

// Constants
const MAX_PROMPT_LENGTH = 5000;

// Files
customizer-page.tsx
prompt-validator.ts
```

#### React Components

- **Functional components** with hooks (no class components)
- **Props interface** defined above component
- **Destructure props** in function signature
- **Early returns** for loading/error states

```typescript
interface CustomizerProps {
  promptId?: number;
  onSave: (prompt: string) => void;
}

export default function Customizer({ promptId, onSave }: CustomizerProps) {
  const [loading, setLoading] = useState(false);
  
  // Early return for loading state
  if (loading) {
    return <Loader />;
  }
  
  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

#### tRPC Procedures

- **Clear procedure names** describing the action
- **Input validation** with Zod schemas
- **Proper error handling** with TRPCError
- **Type-safe returns**

```typescript
export const customizer = {
  generatePrompt: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      objectives: z.string().min(200),
      tone: z.object({
        primary: z.string(),
        secondary: z.string().optional(),
      }),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const result = await invokeLLM({
          messages: [
            { role: "system", content: "You are a video prompt expert." },
            { role: "user", content: `Generate prompt: ${input.name}` },
          ],
        });
        
        return { promptJson: result.choices[0].message.content };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate prompt",
        });
      }
    }),
};
```

### CSS / Tailwind

#### Tailwind Best Practices

- **Use utility classes** instead of custom CSS
- **Responsive design** with mobile-first approach
- **Consistent spacing** using Tailwind's spacing scale
- **Semantic color names** from theme

```tsx
// Good
<div className="flex flex-col gap-4 p-6 bg-background text-foreground rounded-lg shadow-md">
  <h2 className="text-2xl font-bold">Title</h2>
  <p className="text-muted-foreground">Description</p>
</div>

// Bad - mixing custom CSS
<div className="custom-container" style={{ padding: "24px" }}>
  <h2 style={{ fontSize: "24px" }}>Title</h2>
</div>
```

#### Component Styling

- **Use shadcn/ui components** when available
- **Extract repeated patterns** into reusable components
- **Avoid inline styles** unless dynamic

### Database Queries

#### Drizzle ORM Best Practices

- **Use query builder** instead of raw SQL
- **Type-safe queries** with proper relations
- **Efficient queries** - select only needed columns
- **Proper error handling**

```typescript
// Good
const prompts = await db.query.prompts.findMany({
  where: and(
    eq(prompts.industrySector, sector),
    gte(prompts.qualityScore, minScore)
  ),
  columns: {
    id: true,
    title: true,
    promptJson: true,
    qualityScore: true,
  },
  limit: 50,
});

// Bad - selecting all columns when not needed
const prompts = await db.query.prompts.findMany({
  where: eq(prompts.industrySector, sector),
});
```

---

## 📝 Commit Message Format

We follow the **Conventional Commits** specification for clear and structured commit history.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, missing semi-colons)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes to build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Scope

The scope should be the name of the affected module:

- `customizer` - Customizer page and logic
- `validator` - Validator functionality
- `optimizer` - Optimizer tool
- `gallery` - Gallery page
- `templates` - Templates system
- `docs` - Documentation
- `api` - tRPC procedures
- `db` - Database schema or queries
- `ui` - UI components
- `auth` - Authentication

### Subject

- Use imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize first letter
- No period (.) at the end
- Maximum 72 characters

### Body (Optional)

- Use imperative, present tense
- Include motivation for the change
- Contrast with previous behavior

### Footer (Optional)

- Reference issues: `Closes #123`, `Fixes #456`
- Breaking changes: `BREAKING CHANGE: description`

### Examples

#### Feature Addition

```
feat(customizer): add tone variation support

Add ability to select primary and secondary tones in the customizer.
Users can now specify mood keywords and emotional arc for better
prompt generation.

Closes #45
```

#### Bug Fix

```
fix(gallery): correct description extraction from promptJson

Fixed issue where gallery was displaying hardcoded descriptions
instead of extracting from database. Now uses intelligent fallback
logic to extract from subject.description or scene.description.

Fixes #78
```

#### Documentation

```
docs(readme): add comprehensive API reference section

Added detailed documentation for all tRPC procedures including:
- Input parameters with types
- Return value structures
- Example usage
- Error handling
```

#### Breaking Change

```
feat(api): change prompt structure to 9-section format

BREAKING CHANGE: Prompt JSON structure now requires 9 sections
instead of 8. Added "tone" as mandatory first section.

Migration guide:
1. Add tone section to existing prompts
2. Update validation logic
3. Regenerate all cached prompts
```

#### Multiple Changes

```
feat(validator): implement strict evaluation system

- Add ultra-demanding LLM evaluation with world-class expert persona
- Implement automatic penalty detection (-5 to -2 points)
- Add quality score calculation (0-10 scale)
- Create detailed 8-section analysis
- Generate priority improvement suggestions

Closes #92, #93, #94
```

---

## 🔀 Pull Request Process

### Before Submitting

1. **Update your branch** with latest upstream changes:
   ```bash
   git checkout main
   git pull upstream main
   git checkout feature/amazing-feature
   git rebase main
   ```

2. **Run all checks**:
   ```bash
   pnpm test
   pnpm typecheck
   pnpm lint
   pnpm format:check
   ```

3. **Update documentation** if needed:
   - README.md for user-facing changes
   - CONTRIBUTING.md for contributor-facing changes
   - Code comments for complex logic
   - JSDoc for public APIs

### PR Title

Follow the same format as commit messages:

```
feat(customizer): add tone variation support
fix(gallery): correct description extraction
docs(api): add tRPC procedure documentation
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issues
Closes #123
Fixes #456

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Unit tests pass
- [ ] Type checking passes
- [ ] Linting passes
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] My code follows the code style of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### Review Process

1. **Automated checks** must pass (tests, type checking, linting)
2. **At least one maintainer** must approve
3. **All review comments** must be addressed
4. **Conflicts** must be resolved
5. **CI/CD pipeline** must pass

### After Approval

- Maintainers will merge your PR using "Squash and merge"
- Your changes will be included in the next release
- You'll be added to the contributors list

---

## 🧪 Testing Guidelines

### Writing Tests

#### Unit Tests

Use **Vitest** for unit testing:

```typescript
import { describe, it, expect } from "vitest";

describe("Prompt Validator", () => {
  it("should detect generic sequences penalty", () => {
    const prompt = {
      action: {
        sequence: [
          { timing: "0-5s", action: "zoom in" },
          { timing: "5-10s", action: "fade out" }
        ]
      }
    };
    
    const result = validatePrompt(prompt);
    
    expect(result.penalties).toContainEqual({
      type: "generic_sequences",
      points: -5,
      reason: "Generic camera movements detected"
    });
  });
  
  it("should calculate quality score correctly", () => {
    const prompt = createValidPrompt();
    const result = validatePrompt(prompt);
    
    expect(result.qualityScore).toBeGreaterThanOrEqual(0);
    expect(result.qualityScore).toBeLessThanOrEqual(10);
  });
});
```

#### Integration Tests

Test tRPC procedures:

```typescript
import { describe, it, expect } from "vitest";
import { createCaller } from "../server/routers";

describe("Customizer API", () => {
  it("should generate prompt with LLM", async () => {
    const caller = createCaller({ user: mockUser });
    
    const result = await caller.customizer.generatePrompt({
      name: "Test Prompt",
      objectives: "Test objectives with minimum 200 characters...",
      tone: {
        primary: "Elegant",
        secondary: "Warm",
        moodKeywords: "artisanal, premium",
        emotionalArc: "Calm → Satisfied"
      }
    });
    
    expect(result.promptJson).toBeDefined();
    expect(JSON.parse(result.promptJson)).toHaveProperty("tone");
  });
});
```

### Test Coverage

- **Aim for 80%+ coverage** for new code
- **Test edge cases** and error conditions
- **Mock external dependencies** (LLM API, database)
- **Keep tests fast** - under 5 seconds total

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test gallery.test.ts

# Watch mode
pnpm test --watch

# Coverage report
pnpm test --coverage

# Run tests in CI mode
pnpm test --run
```

---

## 📚 Documentation Guidelines

### Code Documentation

#### JSDoc Comments

Use JSDoc for public APIs:

```typescript
/**
 * Validates a custom prompt using ultra-demanding LLM evaluation.
 * 
 * @param promptJson - The JSON string of the prompt to validate
 * @returns Validation result with quality score, penalties, and analysis
 * @throws {TRPCError} If prompt JSON is invalid or LLM fails
 * 
 * @example
 * ```typescript
 * const result = await validateCustomPrompt({
 *   promptJson: JSON.stringify(myPrompt)
 * });
 * console.log(result.qualityScore); // 0-10
 * ```
 */
export async function validateCustomPrompt(
  promptJson: string
): Promise<ValidationResult> {
  // Implementation
}
```

#### Inline Comments

Use inline comments for complex logic:

```typescript
// Extract description with fallback logic:
// 1. Try subject.description
// 2. Try scene.description
// 3. Construct from subject + location
// 4. Use title as fallback
const getDescription = (promptJson: string): string => {
  try {
    const parsed = JSON.parse(promptJson);
    
    // Priority 1: Subject description
    if (parsed.subject?.description) {
      return parsed.subject.description;
    }
    
    // Priority 2: Scene description
    if (parsed.scene?.description) {
      return parsed.scene.description;
    }
    
    // Priority 3: Construct from fields
    if (parsed.scene?.location && parsed.subject?.age) {
      return `${parsed.subject.age}-year-old ${parsed.subject.gender} in ${parsed.scene.location}`;
    }
    
    // Priority 4: Fallback to title
    return parsed.title || "Professional video prompt";
  } catch {
    return "Professional video prompt";
  }
};
```

### README Updates

When adding features, update README.md:

- Add feature to **Features** section
- Add usage example to **Usage Guide**
- Add API reference if applicable
- Update **Roadmap** if completing planned feature

### Changelog

Significant changes should be documented in CHANGELOG.md (if exists).

---

## 🐛 Issue Guidelines

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check documentation** for known solutions
3. **Try latest version** to see if issue is fixed

### Bug Reports

Use the bug report template:

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. macOS 14.0]
 - Browser: [e.g. Chrome 120]
 - Node version: [e.g. 22.13.0]
 - Project version: [e.g. 1.0.0]

**Additional context**
Add any other context about the problem here.
```

### Feature Requests

Use the feature request template:

```markdown
**Is your feature request related to a problem?**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested
- `wontfix` - This will not be worked on
- `duplicate` - This issue or pull request already exists

---

## 🌍 Community

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Pull Requests** - Code contributions and reviews

### Getting Help

If you need help:

1. Check the [Documentation](https://videomarkup-qhqquten.manus.space/documentation)
2. Search [GitHub Issues](https://github.com/Tom198324/video-marketing-prompts/issues)
3. Ask in [GitHub Discussions](https://github.com/Tom198324/video-marketing-prompts/discussions)
4. Create a new issue with `question` label

### Recognition

Contributors are recognized in:

- GitHub Contributors page
- Release notes
- Project README (for significant contributions)

---

## 📄 License

By contributing to Video Marketing Prompts, you agree that your contributions will be licensed under the MIT License.

---

## 🙏 Thank You

Thank you for taking the time to contribute! Every contribution, no matter how small, helps make Video Marketing Prompts better for everyone.

**Happy coding! 🚀**

---

<div align="center">

**Questions?** Open an issue or discussion on GitHub.

[⬆ Back to Top](#contributing-to-video-marketing-prompts)

</div>
