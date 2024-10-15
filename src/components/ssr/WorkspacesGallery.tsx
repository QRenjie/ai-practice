import { WorkspaceState } from "@/types/workspace";
import Image from "next/image";
import Link from "next/link";
import defaultWorkspaceImage from "@/assets/default-workspace-image.svg";
import defaultAvatarImage from "@/assets/default-avater-image.svg";

// 默认头像和图片的URL
const DEFAULT_AVATAR = defaultAvatarImage;
const DEFAULT_IMAGE = defaultWorkspaceImage;
interface WorkspacesGalleryProps {
  workspaces: WorkspaceState[];
}

export default function WorkspacesGallery({
  workspaces,
}: WorkspacesGalleryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {workspaces.map((workspace) => (
        <Link
          href={`/creator/${workspace.id}`}
          key={workspace.id}
          className="block"
        >
          <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-48">
              <Image
                src={workspace.meta.image || DEFAULT_IMAGE}
                alt={workspace.ui.title}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center mb-2">
                <Image
                  src={workspace.meta.user?.avatar || DEFAULT_AVATAR}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded-full mr-2"
                />
                <h3 className="text-lg font-semibold">{workspace.ui.title}</h3>
              </div>
              <p className="text-gray-600">{workspace.ui.title}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
