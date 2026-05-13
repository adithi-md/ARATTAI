# Contributing to Arattai

Thank you for your interest in contributing to Arattai! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Git

### Development Setup

1. **Fork and Clone**
```bash
git clone https://github.com/yourusername/arattai.git
cd arattai
```

2. **Install Dependencies**
```bash
# Frontend
npm install

# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. **Setup Environment**
```bash
# Copy environment files
cp .env.local.example .env.local
cp backend/.env.example backend/.env

# Edit with your credentials
```

4. **Start Services**
```bash
# Option 1: Docker Compose
docker-compose up -d

# Option 2: Manual
# Terminal 1: Backend
cd backend
uvicorn main:app --reload

# Terminal 2: Frontend
npm run dev
```

## 📝 Code Style

### Frontend (TypeScript/React)
- Use TypeScript strict mode
- Follow React best practices
- Use functional components with hooks
- Implement proper error boundaries
- Write meaningful component names

```typescript
// Good
export default function ExpenseCard({ expense }: ExpenseCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div className="glass p-4 rounded-xl">
      {/* Component content */}
    </div>
  );
}

// Bad
export default function Card({ data }: any) {
  // Missing types, unclear naming
}
```

### Backend (Python/FastAPI)
- Follow PEP 8 style guide
- Use type hints
- Write docstrings for functions
- Implement proper error handling
- Use async/await for I/O operations

```python
# Good
async def create_expense(
    expense_data: ExpenseCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
) -> ExpenseResponse:
    """Create a new expense for the user."""
    new_expense = Expense(
        user_id=uuid.UUID(user_id),
        **expense_data.model_dump(),
    )
    db.add(new_expense)
    await db.commit()
    return new_expense

# Bad
def create_expense(data, user, db):
    # Missing types, not async, no docstring
    pass
```

## 🧪 Testing

### Frontend Tests
```bash
# Run tests
npm run test

# Run with coverage
npm run test:coverage
```

### Backend Tests
```bash
cd backend
pytest
pytest --cov=. --cov-report=html
```

### Writing Tests
```python
# Backend test example
async def test_create_expense(client, auth_headers):
    response = await client.post(
        "/api/expenses",
        json={
            "amount": 100.50,
            "product_name": "Test Product",
            "category": "Food",
            "expense_date": "2024-01-15",
        },
        headers=auth_headers,
    )
    assert response.status_code == 201
    assert response.json()["amount"] == 100.50
```

## 🔀 Git Workflow

### Branch Naming
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Test additions

Examples:
- `feature/add-investment-agent`
- `fix/expense-calculation-bug`
- `docs/update-api-documentation`

### Commit Messages
Follow conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

Examples:
```
feat(expenses): add bulk delete functionality

Implement bulk delete for expenses with checkbox selection
and confirmation modal.

Closes #123
```

### Pull Request Process

1. **Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make Changes**
- Write code
- Add tests
- Update documentation

3. **Commit Changes**
```bash
git add .
git commit -m "feat(scope): description"
```

4. **Push to Fork**
```bash
git push origin feature/your-feature-name
```

5. **Create Pull Request**
- Go to GitHub
- Click "New Pull Request"
- Fill in template
- Request review

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

## 🐛 Bug Reports

### Before Submitting
- Check existing issues
- Verify it's reproducible
- Collect relevant information

### Bug Report Template
```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

**Additional context**
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution**
How you'd like it to work

**Describe alternatives**
Other solutions you've considered

**Additional context**
Mockups, examples, etc.
```

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document complex logic
- Include usage examples

```typescript
/**
 * Calculate the progress percentage for a financial goal
 * @param saved - Amount currently saved
 * @param target - Target amount for the goal
 * @returns Progress percentage (0-100)
 * @example
 * calculateProgress(500, 1000) // Returns 50
 */
function calculateProgress(saved: number, target: number): number {
  return (saved / target) * 100;
}
```

### API Documentation
- Update OpenAPI specs
- Include request/response examples
- Document error codes

## 🎨 Design Guidelines

### UI/UX Principles
- Maintain glassmorphism aesthetic
- Use consistent spacing (4px base unit)
- Follow color palette
- Ensure accessibility (WCAG 2.1 AA)
- Mobile-first responsive design

### Component Guidelines
- Reusable and composable
- Props interface documented
- Accessible (ARIA labels)
- Performant (memoization where needed)

## 🔒 Security

### Reporting Security Issues
**DO NOT** open public issues for security vulnerabilities.

Email: security@arattai.ai

Include:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Security Best Practices
- Never commit secrets
- Use environment variables
- Validate all inputs
- Sanitize user data
- Follow OWASP guidelines

## 📞 Getting Help

- **Discord**: https://discord.gg/arattai
- **Email**: dev@arattai.ai
- **Docs**: https://docs.arattai.ai

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## 🙏 Recognition

Contributors will be added to:
- README.md contributors section
- CONTRIBUTORS.md file
- Release notes

Thank you for contributing to Arattai! 🚀
