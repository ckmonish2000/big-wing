import * as pulumi from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";

const droplet = new digitalocean.Droplet("big-wing", {
  region: digitalocean.Region.BLR1, // Bengaluru region
  size: digitalocean.DropletSlug.DropletS1VCPU1GB, // $6/month shared CPU with regular SSD
  image: "ubuntu-20-04-x64", // OS
  userData: `#!/bin/bash
  # Update and install required packages
  apt-get update -y
  apt-get install -y docker.io curl git

  # Install Docker Compose v2
  curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose

  # Start and enable Docker service
  systemctl enable docker
  systemctl start docker

  # Clone repository and setup app
  git clone https://github.com/ckmonish2000/big-wing.git /home/root/app
  cd /home/root/app
  `,
});

export const dropletIp = droplet.ipv4Address;
