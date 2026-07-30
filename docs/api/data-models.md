# Data Models

## User

```json
{
    "id": "stu_001",
    "name": "Alex Johnson",
    "email": "alex@student.edu",
    "avatarUrl": "https://api.dicebear.com/...",
    "studentId": "STU-2024-001",
    "enrolledAt": "2024-01-15T00:00:00Z"
}
```

## Course

```json
{
    "id": "course_001",
    "studentId": "stu_001",
    "title": "Full Stack Web Development",
    "instructor": "Dr. Sarah Chen",
    "thumbnailUrl": "https://picsum.photos/...",
    "description": "Complete web development bootcamp",
    "totalModules": 20,
    "completedModules": 13,
    "status": "in-progress",
    "currentGrade": 87.5,
    "term": "Spring 2024",
    "lastAccessedAt": "2024-01-19T10:00:00Z"
}
```

## Grade Data

```json
{
    "quizScores": [
        { "id": "q1", "label": "Quiz 1", "score": 90, "maxScore": 100 }
    ],
    "gradeDistribution": [{ "grade": "A", "count": 5 }],
    "weeklyProgress": [{ "week": 1, "dateRange": "Jan 8-14", "cumulative": 10 }]
}
```

## Auth Token

```json
{
    "token": "jwt-string",
    "expiresAt": 1705651200000,
    "user": { ... }
}
```
