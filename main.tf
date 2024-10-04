provider "google" {
  project = "cloud-computing-428321"
    credentials = file("./cloud-computing-428321-ee1a1c10bd27.json")
  region  = "us-central1"
}

resource "google_container_cluster" "primary" {
  name               = "my-gke-cluster"
  location           = "us-central1-c"
  initial_node_count = 1

  node_config {
    machine_type = "e2-small"
    disk_size_gb = 20
    disk_type    = "pd-standard"
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform",
    ]
  }
}

