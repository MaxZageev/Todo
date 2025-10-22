pipeline {
    agent any

    environment {
        REGISTRY = "https://docker.io"
        REPO = "vodichkapuzirki/mf"
        PUBLIC_PATH = "/"
        MODULE_NAME = "mf_example"
    }

    stages {
        stage('Install dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                bat 'npx eslint "src/**/*.{ts,tsx}" --fix'
            }
        }

        stage('Checks') {
            steps {
                bat 'npm run check-types'
                bat 'npm run i18next -- -s --fail-on-update --fail-on-warnings'
            }
        }

        stage('Build & Public Docker image') {
            when {
                expression { env.BRANCH_NAME.startsWith('release/') }
            }
            steps {
                script {
                    docker.withRegistry(env.REGISTRY, 'docker-user') {
                        def branchTag

                        if (env.BRANCH_NAME.startsWith('release/')) {
                            branchTag = env.BRANCH_NAME.replaceFirst('release/', '')
                        } else {
                            branchTag = env.BRANCH_NAME.replaceAll('/', '-').toLowerCase()
                        }

                        def shortCommit = env.GIT_COMMIT.take(7)
                        def nonce = UUID.randomUUID().toString().replaceAll("-", "").take(16)
                        env.IMAGE_TAG = "${branchTag}.${String.format('%03d', env.BUILD_NUMBER.toInteger())}"
                        env.STYLE_NONCE = nonce

                        bat "docker build --build-arg PUBLIC_PATH=${PUBLIC_PATH} --build-arg STYLE_NONCE=${STYLE_NONCE} --build-arg VERSION=${IMAGE_TAG} --build-arg GIT_COMMIT=${GIT_COMMIT} --build-arg MODULE_NAME=${MODULE_NAME} -t ${REPO}:${IMAGE_TAG} ."

                        bat "docker push ${REPO}:${IMAGE_TAG}"

                        if (env.BRANCH_NAME.startsWith("release")) {
                            bat "docker tag ${REPO}:${IMAGE_TAG} ${REPO}:latest"
                            bat "docker push ${REPO}:latest"
                        }
                    }
                }
            }
        }

        stage('Deploy to stand') {
            when {
                expression { env.BRANCH_NAME.startsWith('release/') }
            }
            steps {
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            configName: 'vodichka-server',
                            transfers: [
                                sshTransfer(
                                    sourceFiles: '',
                                    removePrefix: '',
                                    remoteDirectory: '/opt/mf',
                                    execCommand: '/opt/mf/deploy.sh',
                                    execTimeout: 120000
                                )
                            ],
                            usePromotionTimestamp: false,
                            verbose: true
                        )
                    ]
                )
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
