from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import User, Counselor, Student, Session, UserProfile
from datetime import datetime, timedelta
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Populate the database with dummy data for analytics dashboard'

    def add_arguments(self, parser):
        parser.add_argument(
            '--students',
            type=int,
            help='Number of students to create',
            default=20
        )
        parser.add_argument(
            '--counselors',
            type=int,
            help='Number of counselors to create',
            default=5
        )
        parser.add_argument(
            '--sessions',
            type=int,
            help='Number of sessions to create',
            default=50
        )

    def handle(self, *args, **options):
        students_count = options['students']
        counselors_count = options['counselors']
        sessions_count = options['sessions']
        
        self.stdout.write('Creating dummy data...')
        
        # Create counselors
        counselors = self.create_counselors(counselors_count)
        
        # Create students
        students = self.create_students(students_count)
        
        # Create sessions
        self.create_sessions(sessions_count, students, counselors)
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {counselors_count} counselors, '
                f'{students_count} students, and {sessions_count} sessions'
            )
        )

    def create_counselors(self, count):
        """Create dummy counselors"""
        counselors = []
        specializations = [
            'Academic Counseling', 'Emotional Support', 'Career Guidance',
            'Social Skills', 'Mental Health', 'Study Skills', 'Stress Management'
        ]
        
        for i in range(count):
            username = f'counselor{i+1}'
            email = f'counselor{i+1}@example.com'
            
            # Create user
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': email,
                    'first_name': f'Counselor',
                    'last_name': f'{i+1}',
                    'role': 'counselor',
                    'is_counselor': True
                }
            )
            
            if created:
                user.set_password('password123')
                user.save()
            
            # Create counselor profile
            counselor, created = Counselor.objects.get_or_create(
                user=user,
                defaults={
                    'name': f'Counselor {i+1}',
                    'email': email,
                    'specialization': random.choice(specializations)
                }
            )
            
            counselors.append(counselor)
            self.stdout.write(f'Created counselor: {counselor.name}')
        
        return counselors

    def create_students(self, count):
        """Create dummy students"""
        students = []
        counseling_types = ['academic', 'emotional', 'career', 'social']
        
        for i in range(count):
            username = f'student{i+1}'
            email = f'student{i+1}@example.com'
            
            # Create user
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    'email': email,
                    'first_name': f'Student',
                    'last_name': f'{i+1}',
                    'role': 'student',
                    'is_counselor': False
                }
            )
            
            if created:
                user.set_password('password123')
                user.save()
            
            # Create student profile
            enrollment_date = datetime.now().date() - timedelta(days=random.randint(30, 365))
            pre_score = random.uniform(1.0, 5.0)
            post_score = pre_score + random.uniform(0.5, 2.0)  # Post score should be higher
            improvement_score = post_score - pre_score
            
            student, created = Student.objects.get_or_create(
                user=user,
                defaults={
                    'name': f'Student {i+1}',
                    'enrollment_date': enrollment_date,
                    'counseling_type': random.choice(counseling_types),
                    'pre_counseling_score': round(pre_score, 2),
                    'post_counseling_score': round(post_score, 2),
                    'improvement_score': round(improvement_score, 2)
                }
            )
            
            students.append(student)
            self.stdout.write(f'Created student: {student.name}')
        
        return students

    def create_sessions(self, count, students, counselors):
        """Create dummy sessions"""
        session_types = ['academic', 'emotional', 'career', 'social']
        statuses = ['scheduled', 'completed', 'cancelled']
        
        for i in range(count):
            student = random.choice(students)
            counselor = random.choice(counselors)
            
            # Create session date (mix of past and future)
            if random.choice([True, False]):
                # Past session
                session_date = datetime.now().date() - timedelta(days=random.randint(1, 180))
                status = random.choice(['completed', 'cancelled'])
            else:
                # Future session
                session_date = datetime.now().date() + timedelta(days=random.randint(1, 30))
                status = 'scheduled'
            
            session_time = datetime.strptime(f"{random.randint(9, 17)}:{random.choice(['00', '30'])}", "%H:%M").time()
            
            session = Session.objects.create(
                student=student,
                counselor=counselor,
                session_type=random.choice(session_types),
                date=session_date,
                time=session_time,
                improvement_score=round(random.uniform(0.5, 2.0), 2) if status == 'completed' else 0,
                status=status,
                notes=f'Session notes for {student.name} with {counselor.name}'
            )
            
            self.stdout.write(f'Created session: {session}')
