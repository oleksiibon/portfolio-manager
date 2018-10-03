# Generated by Django 2.1 on 2018-10-02 08:26

from django.db import migrations, models
import django.db.models.deletion
import employee.models


class Migration(migrations.Migration):

    dependencies = [
        ('employee', '0018_auto_20180927_1205'),
    ]

    operations = [
        migrations.CreateModel(
            name='FilesGroup',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=64)),
            ],
            options={
                'db_table': 'files_groups',
            },
        ),
        migrations.RunSQL(
            """
            INSERT INTO `files_groups` (name) 
            values ('No group'), 
            ('Documents'), 
            ('Source Codes'), 
            ('Proposals'), 
            ('Specifications'), 
            ('Marketing'), 
            ('Contracts'), 
            ('Timesheets'),
            ('Screenshots')
            """),
        migrations.CreateModel(
            name='ProjectFile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to=employee.models.project_directory_path)),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='employee.FilesGroup')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='employee.Project')),
            ],
            options={
                'db_table': 'project_files',
            },
        ),
    ]
