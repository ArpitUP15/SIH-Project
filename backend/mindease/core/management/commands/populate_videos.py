from django.core.management.base import BaseCommand
from core.models import Video
import json


class Command(BaseCommand):
    help = 'Populate the database with initial video data from JSON'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            help='Path to JSON file containing video data',
            default='videos.json'
        )

    def handle(self, *args, **options):
        file_path = options['file']
        
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                videos_data = json.load(file)
            
            created_count = 0
            updated_count = 0
            
            for video_data in videos_data:
                # Remove 'id' from the data since we'll use auto-generated IDs
                video_data.pop('id', None)
                
                # Check if video already exists by title
                existing_video = Video.objects.filter(title=video_data['title']).first()
                
                if existing_video:
                    # Update existing video
                    for key, value in video_data.items():
                        setattr(existing_video, key, value)
                    existing_video.save()
                    updated_count += 1
                    self.stdout.write(
                        self.style.WARNING(f'Updated video: {existing_video.title}')
                    )
                else:
                    # Create new video
                    Video.objects.create(**video_data)
                    created_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(f'Created video: {video_data["title"]}')
                    )
            
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully processed {len(videos_data)} videos. '
                    f'Created: {created_count}, Updated: {updated_count}'
                )
            )
            
        except FileNotFoundError:
            self.stdout.write(
                self.style.ERROR(f'File {file_path} not found.')
            )
        except json.JSONDecodeError:
            self.stdout.write(
                self.style.ERROR(f'Invalid JSON format in {file_path}')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error processing file: {str(e)}')
            )
