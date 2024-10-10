import { WorkspaceState } from "@/types/workspace";
import Image from "next/image";
import { useState } from "react";

interface WorkspaceGalleryProps {
  workspaces: WorkspaceState[];
  itemsPerPage: number;
}

export default function WorkspacesGallery({
  workspaces,
  itemsPerPage,
}: WorkspaceGalleryProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWorkspaces = workspaces.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(workspaces.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentWorkspaces.map((workspace) => (
          <div
            key={workspace.id}
            className="bg-white rounded-lg overflow-hidden shadow-lg"
          >
            <Image
              src={workspace.meta.image || ""}
              alt={workspace.ui.title}
              width={300}
              height={200}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center mb-2">
                <Image
                  src={workspace.meta.user?.avatar || ""}
                  alt="Author"
                  width={24}
                  height={24}
                  className="rounded-full mr-2"
                />
                <p className="text-sm">{workspace.meta.user?.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
